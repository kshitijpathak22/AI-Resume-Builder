import os
import re
import json
import io
import base64
import PyPDF2
import docx
import jwt
import tempfile
import pymupdf4llm
import markdown
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from supabase import create_client, Client

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from dotenv import load_dotenv

# Load environment variables
# Try the parent .env.local (local dev) — on Render this silently does nothing
# because Render sets env vars via its own dashboard.
load_dotenv(dotenv_path="../.env.local")
load_dotenv()  # Also try .env in current directory

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Clerk JWT Security ─────────────────────────────────────────────
security = HTTPBearer()

publishable_key = os.getenv("VITE_CLERK_PUBLISHABLE_KEY")
CLERK_JWKS_URL = ""
if publishable_key:
    try:
        parts = publishable_key.split('_')
        if len(parts) >= 3:
            b64_str = parts[2]
            b64_str += "=" * ((4 - len(b64_str) % 4) % 4)
            decoded = base64.b64decode(b64_str).decode('utf-8')
            if decoded.endswith('$'):
                decoded = decoded[:-1]
            CLERK_JWKS_URL = f"https://{decoded}/.well-known/jwks.json"
    except Exception as e:
        print("Failed to decode Clerk publishable key:", e)

jwks_client = jwt.PyJWKClient(CLERK_JWKS_URL) if CLERK_JWKS_URL else None

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not jwks_client:
        print("Warning: Clerk JWKS URL not configured, skipping token verification.")
        return {"sub": "dev_user"}
        
    token = credentials.credentials
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False}
        )
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


# ─── Health check ──────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok"}


# ─── Supabase Client ───────────────────────────────────────────────
supabase_url = os.getenv("VITE_SUPABASE_URL")
supabase_key = os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY")

if not supabase_url or not supabase_key:
    print("WARNING: Supabase URL or Key not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.")

supabase: Client = create_client(supabase_url or "", supabase_key or "")

# ─── Gemini LLM ────────────────────────────────────────────────────
api_key = os.getenv("VITE_GOOGLE_AI_API_KEY") or os.getenv("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=api_key,
    max_output_tokens=4096
)


# ═══════════════════════════════════════════════════════════════════
# ROBUST JSON PARSING UTILITY
# ═══════════════════════════════════════════════════════════════════

def robust_json_parse(raw_text: str) -> dict:
    """
    Parse JSON from LLM output with multiple fallback strategies.
    LLMs frequently produce slightly malformed JSON (raw newlines in strings,
    markdown wrappers, trailing commas, etc.). This function handles all of those.
    """
    # Step 1: Strip markdown code fences
    text = raw_text.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    text = text.strip()

    # Step 2: Try direct parse first (fast path)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Step 3: Fix common LLM JSON issues
    # 3a: Remove trailing commas before } or ]
    cleaned = re.sub(r',\s*([}\]])', r'\1', text)

    # 3b: Fix raw newlines inside JSON string values
    # This is the main culprit for "Unterminated string" errors.
    # We walk through char by char and replace literal \n inside strings with \\n
    fixed_chars = []
    in_string = False
    escape_next = False
    for ch in cleaned:
        if escape_next:
            fixed_chars.append(ch)
            escape_next = False
            continue
        if ch == '\\':
            fixed_chars.append(ch)
            escape_next = True
            continue
        if ch == '"':
            in_string = not in_string
            fixed_chars.append(ch)
            continue
        if in_string and ch == '\n':
            fixed_chars.append(' ')  # Replace raw newline with space
            continue
        if in_string and ch == '\r':
            continue  # Skip carriage returns inside strings
        if in_string and ch == '\t':
            fixed_chars.append(' ')  # Replace tabs with space
            continue
        fixed_chars.append(ch)

    cleaned = ''.join(fixed_chars)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Step 4: Try to extract JSON object from surrounding text
    # Sometimes the LLM wraps JSON in explanation text
    match = re.search(r'\{[\s\S]*\}', cleaned)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    # Step 5: Last resort — try fixing with aggressive cleanup
    # Remove all control characters except \n (which we already handled)
    last_resort = re.sub(r'[\x00-\x1f\x7f]', ' ', text)
    last_resort = re.sub(r',\s*([}\]])', r'\1', last_resort)
    match = re.search(r'\{[\s\S]*\}', last_resort)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse JSON after all cleanup attempts: {e}\nRaw text (first 500 chars): {raw_text[:500]}")

    raise ValueError(f"No JSON object found in LLM response. Raw text (first 500 chars): {raw_text[:500]}")


# ─── camelCase ↔ snake_case mapping ────────────────────────────────
CAMEL_TO_SNAKE = {
    "firstName": "first_name",
    "lastName": "last_name",
    "jobTitle": "job_title",
    "themeColor": "theme_color",
    "userEmail": "user_email",
    "userName": "user_name",
    "resumeId": "resume_id",
    "Education": "education",
    "isFreeform": "is_freeform",
}

SNAKE_TO_CAMEL = {v: k for k, v in CAMEL_TO_SNAKE.items()}


def to_snake(data: dict) -> dict:
    """Convert camelCase keys to snake_case for DB storage."""
    result = {}
    for key, value in data.items():
        col = CAMEL_TO_SNAKE.get(key, key)
        result[col] = value
    return result


def to_camel(data: dict) -> dict:
    """Convert snake_case DB columns back to camelCase for frontend."""
    result = dict(data)  # keep all original keys too
    for snake, camel in SNAKE_TO_CAMEL.items():
        if snake in data:
            result[camel] = data[snake]
    return result


# ═══════════════════════════════════════════════════════════════════
# RESUME CRUD API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════

class CreateResumeRequest(BaseModel):
    title: str
    resumeId: str
    userEmail: str
    userName: Optional[str] = None


class ExperienceItem(BaseModel):
    title: Optional[str] = None
    companyName: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    workSummary: Optional[str] = None

class EducationItem(BaseModel):
    universityName: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    degree: Optional[str] = None
    major: Optional[str] = None
    description: Optional[str] = None

class SkillItem(BaseModel):
    name: Optional[str] = None
    rating: Optional[int] = None

class ResumeUpdates(BaseModel):
    title: Optional[str] = None
    resumeId: Optional[str] = None
    userEmail: Optional[str] = None
    userName: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    jobTitle: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    themeColor: Optional[str] = None
    summary: Optional[str] = None
    Experience: Optional[List[ExperienceItem]] = None
    Education: Optional[List[EducationItem]] = None
    skills: Optional[List[SkillItem]] = None
    isFreeform: Optional[bool] = None
    content: Optional[str] = None
    
    class Config:
        extra = "allow" # allow extra fields to prevent breaking changes if new fields are added

class UpdateResumeRequest(BaseModel):
    updates: ResumeUpdates


@app.post("/api/resumes")
async def create_resume(req: CreateResumeRequest, payload: dict = Depends(verify_token)):
    """Create a new empty resume."""
    try:
        result = supabase.table("user_resumes").insert({
            "title": req.title,
            "resume_id": req.resumeId,
            "user_email": req.userEmail,
            "user_name": req.userName,
        }).execute()
        return to_camel(result.data[0])
    except Exception as e:
        print("Create resume error:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/resumes")
async def get_user_resumes(userEmail: str, payload: dict = Depends(verify_token)):
    """Get all resumes for a user by email."""
    try:
        result = supabase.table("user_resumes") \
            .select("*") \
            .eq("user_email", userEmail) \
            .order("created_at", desc=True) \
            .execute()
        return [to_camel(r) for r in result.data]
    except Exception as e:
        print("Get resumes error:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/resumes/{resume_id}")
async def get_resume_by_id(resume_id: str, payload: dict = Depends(verify_token)):
    """Get a single resume by its UUID."""
    try:
        result = supabase.table("user_resumes") \
            .select("*") \
            .eq("id", resume_id) \
            .single() \
            .execute()
        return to_camel(result.data)
    except Exception as e:
        print("Get resume error:", e)
        raise HTTPException(status_code=404, detail=str(e))


@app.put("/api/resumes/{resume_id}")
async def update_resume(resume_id: str, req: UpdateResumeRequest, payload: dict = Depends(verify_token)):
    """Update a resume's fields."""
    try:
        # Convert pydantic model to dict, exclude unset values so we don't overwrite with None
        updates_dict = req.updates.model_dump(exclude_unset=True)
        mapped = to_snake(updates_dict)
        result = supabase.table("user_resumes") \
            .update(mapped) \
            .eq("id", resume_id) \
            .execute()
        return to_camel(result.data[0]) if result.data else {"success": True}
    except Exception as e:
        print("Update resume error:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/resumes/{resume_id}")
async def delete_resume(resume_id: str, payload: dict = Depends(verify_token)):
    """Delete a resume by its UUID."""
    try:
        supabase.table("user_resumes") \
            .delete() \
            .eq("id", resume_id) \
            .execute()
        return {"success": True}
    except Exception as e:
        print("Delete resume error:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ═══════════════════════════════════════════════════════════════════
# INTERVIEW AI ENDPOINTS
# ═══════════════════════════════════════════════════════════════════

class MessageData(BaseModel):
    role: str  # "system", "human", or "ai"
    content: str

class NextQuestionRequest(BaseModel):
    resumeData: Dict[str, Any]
    history: List[MessageData]
    userAnswer: Optional[str] = None

class FeedbackRequest(BaseModel):
    history: List[MessageData]

class HintRequest(BaseModel):
    resumeData: Dict[str, Any]
    currentQuestion: str
    currentAnswer: Optional[str] = None

def parse_history(history: List[MessageData]):
    parsed = []
    for msg in history:
        if msg.role == "system":
            parsed.append(SystemMessage(content=msg.content))
        elif msg.role == "human":
            parsed.append(HumanMessage(content=msg.content))
        elif msg.role == "ai":
            parsed.append(AIMessage(content=msg.content))
    return parsed

@app.post("/api/interview/next")
async def next_question(req: NextQuestionRequest, payload: dict = Depends(verify_token)):
    messages = parse_history(req.history)
    
    if not messages:
        sys_prompt = f"""
      You are an expert technical and behavioral interviewer.
      You are conducting a mock interview for a candidate based on the following resume data:
      {json.dumps(req.resumeData)}
      
      RULES:
      1. You must ask exactly 5 sequential questions.
      2. Ask ONE question at a time. Do not ask multiple questions in a single response.
      3. Wait for the user's answer before asking the next question.
      4. Your questions should be highly tailored to the candidate's specific experience, skills, and summary provided in the resume.
      5. Keep your questions professional, concise, and challenging but fair.
      6. Do not provide feedback on their answers during the interview. Just ask the next question or acknowledge their answer briefly.
      7. For your very first message, just ask the first interview question directly.
        """
        messages.append(SystemMessage(content=sys_prompt))
        messages.append(HumanMessage(content="Hi! I am ready to begin the interview. Please ask the first question."))
    
    elif req.userAnswer:
        messages.append(HumanMessage(content=req.userAnswer))
        
    try:
        response = llm.invoke(messages)
        return {
            "question": response.content,
            "new_history": [
                {"role": m.type, "content": m.content} for m in messages
            ] + [{"role": "ai", "content": response.content}]
        }
    except Exception as e:
        print("LangChain Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interview/feedback")
async def final_feedback(req: FeedbackRequest, payload: dict = Depends(verify_token)):
    transcript_lines = []
    for m in req.history:
        if m.role == "human":
            transcript_lines.append(f"Candidate: {m.content}")
        elif m.role == "ai":
            transcript_lines.append(f"Interviewer: {m.content}")
            
    transcript = "\n\n".join(transcript_lines)
    
    feedback_prompt = f"""
      The mock interview has concluded. Please evaluate the candidate's performance based on the following transcript:
      
      {transcript}
      
      You MUST return your evaluation STRICTLY as a raw JSON object with no markdown formatting, no code blocks, and no backticks. The JSON structure must exactly match this format:
      {{
        "score": "A number out of 10",
        "strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4", "Strength 5"],
        "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3", "Weakness 4", "Weakness 5"],
        "betterAnswers": ["Question 1: What you should have said based on your resume", "Question 2: What you should have said..."]
      }}
    """
    
    try:
        response = llm.invoke([HumanMessage(content=feedback_prompt)])
        return robust_json_parse(response.content)
    except ValueError as e:
        print("Error parsing feedback JSON:", e)
        # Return a graceful fallback instead of crashing
        return {
            "score": "N/A",
            "strengths": ["Could not generate detailed feedback"],
            "weaknesses": ["Please try again"],
            "betterAnswers": ["The AI response was malformed. Please retry the interview."]
        }
    except Exception as e:
        print("Error generating feedback:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interview/hint")
async def get_hint(req: HintRequest, payload: dict = Depends(verify_token)):
    hint_prompt = f"""
    The candidate is currently answering this interview question: "{req.currentQuestion}"
    Based on their resume: {json.dumps(req.resumeData)}
    
    Their current answer so far (if any): {req.currentAnswer or "None provided yet."}
    
    Provide a very brief (1-2 sentences) and actionable hint to help them answer this question better by leveraging specific experience from their resume.
    """
    
    try:
        response = llm.invoke([HumanMessage(content=hint_prompt)])
        return {"hint": response.content.strip()}
    except Exception as e:
        print("Error generating hint:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ═══════════════════════════════════════════════════════════════════
# RESUME PARSING ENDPOINT
# ═══════════════════════════════════════════════════════════════════

@app.post("/api/resume/parse")
async def parse_resume(file: UploadFile = File(...), payload: dict = Depends(verify_token)):
    text = ""
    try:
        content = await file.read()
        if file.filename.lower().endswith('.pdf'):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp.write(content)
                tmp_path = tmp.name
            
            try:
                # Use pymupdf4llm to extract Markdown preserving layout
                text = pymupdf4llm.to_markdown(tmp_path)
            finally:
                os.remove(tmp_path)
        elif file.filename.lower().endswith('.docx'):
            doc = docx.Document(io.BytesIO(content))
            for para in doc.paragraphs:
                text += para.text + "\n\n"
        else:
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")
    except HTTPException:
        raise
    except Exception as e:
        print("Error reading file:", e)
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")
        
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the document.")

    # Return the parsed HTML as freeform content instead of calling Gemini
    html_content = markdown.markdown(text, extensions=['tables', 'fenced_code'])
    return {
        "isFreeform": True,
        "content": html_content
    }
