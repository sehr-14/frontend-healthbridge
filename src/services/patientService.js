const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const patientService = {
  async updateProfile(profilePayload, token) {
    const res = await fetch(`${BASE_URL}/patients/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profilePayload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Profile update failed");
    return data;
  },

  async getProfile(token) {
    const res = await fetch(`${BASE_URL}/patients/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch profile");
    return data;
  },

  async getAppointments(token) {
    const res = await fetch(`${BASE_URL}/patients/me/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch appointments");
    return data;
  },
};
