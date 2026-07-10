/**
 * GlobalApi — Frontend service layer.
 * All calls go to the Python FastAPI backend (http://localhost:8000).
 * The backend handles Supabase internally — no DB credentials in the browser.
 */

export const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

/**
 * Create a new resume.
 */
const CreateNewResume = async (data, token) => {
  const res = await fetch(`${API_BASE}/api/resumes`, {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create resume");
  }
  return res.json();
};

/**
 * Get all resumes for a user by email.
 */
const GetUserResumes = async (userEmail, token) => {
  const res = await fetch(
    `${API_BASE}/api/resumes?userEmail=${encodeURIComponent(userEmail)}`,
    { headers: { "Authorization": `Bearer ${token}` } }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch resumes");
  }
  return res.json();
};

/**
 * Update a resume by its UUID.
 */
const UpdateResumeDetail = async (id, updates, token) => {
  const res = await fetch(`${API_BASE}/api/resumes/${id}`, {
    method: "PUT",
    headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ updates }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update resume");
  }
  return res.json();
};

/**
 * Get a single resume by its UUID.
 */
const GetResumeById = async (id, token) => {
  const headers = {};
  if (token) {
      headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/api/resumes/${id}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch resume");
  }
  return res.json();
};

/**
 * Delete a resume by its UUID.
 */
const DeleteResumeById = async (id, token) => {
  const res = await fetch(`${API_BASE}/api/resumes/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete resume");
  }
  return res.json();
};

export default {
  API_BASE,
  CreateNewResume,
  GetUserResumes,
  UpdateResumeDetail,
  GetResumeById,
  DeleteResumeById,
};