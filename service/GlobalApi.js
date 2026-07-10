/**
 * GlobalApi — Frontend service layer.
 * All calls go to the Python FastAPI backend (http://localhost:8000).
 * The backend handles Supabase internally — no DB credentials in the browser.
 */

export const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

/**
 * Create a new resume.
 */
const CreateNewResume = async (data) => {
  const res = await fetch(`${API_BASE}/api/resumes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
const GetUserResumes = async (userEmail) => {
  const res = await fetch(
    `${API_BASE}/api/resumes?userEmail=${encodeURIComponent(userEmail)}`
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
const UpdateResumeDetail = async (id, updates) => {
  const res = await fetch(`${API_BASE}/api/resumes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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
const GetResumeById = async (id) => {
  const res = await fetch(`${API_BASE}/api/resumes/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch resume");
  }
  return res.json();
};

/**
 * Delete a resume by its UUID.
 */
const DeleteResumeById = async (id) => {
  const res = await fetch(`${API_BASE}/api/resumes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete resume");
  }
  return res.json();
};

export default {
  CreateNewResume,
  GetUserResumes,
  UpdateResumeDetail,
  GetResumeById,
  DeleteResumeById,
};