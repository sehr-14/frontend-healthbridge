const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const getToken = () => {
  try {
    const stored = localStorage.getItem("sync_auth");
    return stored ? JSON.parse(stored).token : null;
  } catch {
    return null;
  }
};

// ─── Auth Service ──────────────────────────────────────────────────────────────
export const authService = {
  async login({ email, password }) {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  },

  async register(payload) {
    const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  },
};

// ─── Patient Service ───────────────────────────────────────────────────────────
export const patientService = {
  async updateProfile(profileData) {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/v1/patients/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  },
};

// ─── Doctor Service ────────────────────────────────────────────────────────────
export const doctorService = {
  async registerDoctor(payload) {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/v1/doctors/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  },

  // Future: implement when backend ready
  async createAvailability(slots) {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/v1/doctors/availability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ slots }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  },
};
