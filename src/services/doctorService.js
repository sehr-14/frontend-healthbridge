const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const doctorService = {
  async registerDoctor(payload, token) {
    const res = await fetch(`${BASE_URL}/doctors/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Doctor registration failed");
    return data;
  },

  async getProfile(id, token) {
    const res = await fetch(`${BASE_URL}/doctors/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch doctor");
    return data;
  },

  async listDoctors(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/doctors?${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch doctors");
    return data;
  },

  async updateProfile(payload, token) {
    const res = await fetch(`${BASE_URL}/doctors/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Update failed");
    return data;
  },

  async getAppointments(token) {
    const res = await fetch(`${BASE_URL}/doctors/me/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch appointments");
    return data;
  },

  async saveNotes(appointmentId, notes, token) {
    const res = await fetch(`${BASE_URL}/appointments/${appointmentId}/notes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to save notes");
    return data;
  },
};
