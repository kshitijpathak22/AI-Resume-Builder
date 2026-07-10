import os
import json
import io
import PyPDF2
import docx
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from supabase import create_client, Client

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from dotenv import load_dotenv

# Load environment variables (to get keys from the root .env.local)
load_dotenv(dotenv_path="../.env.local")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Supabase Client ───────────────────────────────────────────────
supabase_url = os.getenv("VITE_SUPABASE_URL")
supabase_key = os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY")

if not supabase_url or not supabase_key:
    print("WARNING: Supabase URL or Key not found in .env.local")

supabase: Client = create_client(supabase_url or "", supabase_key or "")

# ─── Gemini LLM ────────────────────────────────────────────────────
api_key = os.getenv("VITE_GOOGLE_AI_API_KEY")
if not api_key:
    api_key = os.getenv("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=api_key,
    max_output_tokens=2048
)

# ─── camelCase ↔ snake_case mapping ────────────────────────────────
CAMEL_TO_SNAKE = {
    "firstName": "first_name",
    "lastName": "last_name",
    "jobTitle": "job_title",
    "themeColor": "theme_color",
    "userEmail": "user_email",
    "userName": "user_name",
    "resumeId": "resume_id",
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


class UpdateResumeRequest(BaseModel):
    updates: Dict[str, Any]


@app.post("/api/resumes")
async def create_resume(req: CreateResumeRequest):
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
async def get_user_resumes(userEmail: str):
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
async def get_resume_by_id(resume_id: str):
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
async def update_resume(resume_id: str, req: UpdateResumeRequest):
    """Update a resume's fields."""
    try:
        mapped = to_snake(req.updates)
        result = supabase.table("user_resumes") \
            .update(mapped) \
            .eq("id", resume_id) \
            .execute()
        return to_camel(result.data[0]) if result.data else {"success": True}
    except Exception as e:
        print("Update resume error:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/resumes/{resume_id}")
async def delete_resume(resume_id: str):
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
# INTERVIEW AI ENDPOINTS (existing)
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
async def next_question(req: NextQuestionRequest):
    messages = parse_history(req.history)
    
    # If history is empty, initialize system prompt
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
        # Gemini requires at least one human message to generate a response
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
async def final_feedback(req: FeedbackRequest):
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
        json_str = response.content.replace("```json", "").replace("```", "").strip()
        return json.loads(json_str)
    except Exception as e:
        print("Error generating feedback:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interview/hint")
async def get_hint(req: HintRequest):
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
# RESUME PARSING ENDPOINT (existing)
# ═══════════════════════════════════════════════════════════════════

@app.post("/api/resume/parse")
async def parse_resume(file: UploadFile = File(...)):
    text = ""
    try:
        content = await file.read()
        if file.filename.lower().endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        elif file.filename.lower().endswith('.docx'):
            doc = docx.Document(io.BytesIO(content))
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")
    except Exception as e:
        print("Error reading file:", e)
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")
        
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the document.")

    parse_prompt = f"""
    You are an expert resume parser. I will provide you with the raw text extracted from a user's resume document.
    Your task is to parse this text and map it STRICTLY to the following JSON structure. 
    If information is missing, leave the string empty "" or array empty []. Do not make up information.
    
    CRITICAL RULES FOR JSON:
    1. You MUST properly escape all double quotes (\\") inside string values.
    2. You MUST NOT include raw literal newline characters inside string values. Replace them with spaces or HTML tags like <br/>.
    3. The output MUST be perfectly valid JSON parseable by standard JSON parsers.
    
    REQUIRED JSON STRUCTURE:
    {{
      "firstName": "string",
      "lastName": "string",
      "jobTitle": "string",
      "address": "string",
      "phone": "string",
      "email": "string",
      "themeColor": "#0ea5e9", 
      "summary": "string (professional summary)",
      "Experience": [
        {{
          "title": "string",
          "companyName": "string",
          "city": "string",
          "state": "string",
          "startDate": "string (YYYY-MM-DD or MM/YYYY)",
          "endDate": "string (YYYY-MM-DD or MM/YYYY or Present)",
          "workSummary": "string (Detailed HTML format starting with <p> and using <ul><li> for bullet points. IMPORTANT: Format this properly as HTML so it renders nicely in a Rich Text Editor)"
        }}
      ],
      "Education": [
        {{
          "universityName": "string",
          "startDate": "string",
          "endDate": "string",
          "degree": "string",
          "major": "string",
          "description": "string"
        }}
      ],
      "skills": [
        {{
          "name": "string",
          "rating": 100
        }}
      ]
    }}
    
    RAW RESUME TEXT:
    {text}
    
    You MUST return ONLY the raw JSON object with no markdown formatting, no code blocks, and no backticks.
    """
    
    try:
        response = llm.invoke([HumanMessage(content=parse_prompt)])
        json_str = response.content.replace("```json", "").replace("```", "").strip()
        parsed_data = json.loads(json_str)
        return parsed_data
    except Exception as e:
        print("Error parsing with Gemini:", e)
        raise HTTPException(status_code=500, detail=str(e))
