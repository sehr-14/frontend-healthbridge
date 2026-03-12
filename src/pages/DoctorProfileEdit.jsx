import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doctorService } from "../services/doctorService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SPECIALTIES = [
  "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
  "Orthopedic Surgeon", "Gynecologist", "Pediatrician", "Psychiatrist",
  "Ophthalmologist", "ENT Specialist", "Urologist", "Oncologist",
  "Gastroenterologist", "Pulmonologist", "Endocrinologist", "Dentist",
];

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot"];

export default function DoctorProfileEdit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    specialty: "", sub_specialty: "", city: "", clinic_name: "",
    clinic_address: "", years_of_experience: "", online_fee: "",
    physical_fee: "", home_visit_fee: "", about: "",
  });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = "0";
      containerRef.current.style.transform = "translateY(20px)";
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = "all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)";
          containerRef.current.style.opacity = "1";
          containerRef.current.style.transform = "translateY(0)";
        }
      }, 60);
    }

    const token = localStorage.getItem("sync_auth");
    doctorService.getProfile("me", token).then((data) => {
      setForm({
        specialty: data.specialty || "",
        sub_specialty: data.sub_specialty || "",
        city: data.city || "",
        clinic_name: data.clinic_name || "",
        clinic_address: data.clinic_address || "",
        years_of_experience: data.years_of_experience || "",
        online_fee: data.online_fee || "",
        physical_fee: data.physical_fee || "",
        home_visit_fee: data.home_visit_fee || "",
        about: data.about || "",
      });
    }).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);
    try {
      const token = localStorage.getItem("sync_auth");
      await doctorService.updateProfile({
        ...form,
        years_of_experience: form.years_of_experience ? Number(form.years_of_experience) : undefined,
        online_fee: Number(form.online_fee),
        physical_fee: Number(form.physical_fee),
        home_visit_fee: form.home_visit_fee ? Number(form.home_visit_fee) : undefined,
      }, token);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { borderColor: "rgba(46,64,54,0.15)", background: "#F2F0E9", color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" };
  const inputClass = "w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 text-sm";
  const labelStyle = { color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" };

  return (
    <div className="min-h-screen hex-bg">
      <Navbar />
      <div className="pt-28 pb-16 px-4" ref={containerRef}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#CC5833", opacity: 0.7, fontFamily: "'IBM Plex Mono', monospace" }}>
                Practice settings
              </p>
              <h1 className="text-3xl font-bold" style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}>
                Edit your profile
              </h1>
            </div>
            <button
              onClick={() => navigate("/doctor/dashboard")}
              className="text-sm transition-opacity hover:opacity-60"
              style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'Outfit', sans-serif" }}
            >
              Back to dashboard
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {success && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(46,64,54,0.08)", color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}>
                Profile updated successfully.
              </div>
            )}
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(204,88,51,0.08)", color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}>
                {error}
              </div>
            )}

            {/* Professional info */}
            <div className="rounded-2xl p-6 border" style={{ background: "#fff", borderColor: "rgba(204,88,51,0.08)" }}>
              <p className="text-xs uppercase tracking-widest mb-5" style={{ ...labelStyle, opacity: 0.7 }}>
                Professional info
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={labelStyle}>Specialty</label>
                  <select className={inputClass} style={inputStyle} value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}>
                    <option value="">Select</option>
                    {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={labelStyle}>Sub-specialty</label>
                  <input type="text" className={inputClass} style={inputStyle} value={form.sub_specialty} onChange={(e) => setForm({ ...form, sub_specialty: e.target.value })} placeholder="Optional" onFocus={(e) => (e.target.style.borderColor = "#CC5833")} onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={labelStyle}>City</label>
                  <select className={inputClass} style={inputStyle} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                    <option value="">Select city</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={labelStyle}>Experience (yrs)</label>
                  <input type="number" min="0" className={inputClass} style={inputStyle} value={form.years_of_experience} onChange={(e) => setForm({ ...form, years_of_experience: e.target.value })} placeholder="10" onFocus={(e) => (e.target.style.borderColor = "#CC5833")} onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-wider mb-2" style={labelStyle}>Clinic / Hospital</label>
                  <input type="text" className={inputClass} style={inputStyle} value={form.clinic_name} onChange={(e) => setForm({ ...form, clinic_name: e.target.value })} placeholder="City Hospital" onFocus={(e) => (e.target.style.borderColor = "#CC5833")} onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-wider mb-2" style={labelStyle}>Clinic address</label>
                  <input type="text" className={inputClass} style={inputStyle} value={form.clinic_address} onChange={(e) => setForm({ ...form, clinic_address: e.target.value })} placeholder="Street, Area" onFocus={(e) => (e.target.style.borderColor = "#CC5833")} onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                </div>
              </div>
            </div>

            {/* Fees */}
            <div className="rounded-2xl p-6 border" style={{ background: "#fff", borderColor: "rgba(204,88,51,0.08)" }}>
              <p className="text-xs uppercase tracking-widest mb-5" style={{ ...labelStyle, opacity: 0.7 }}>
                Consultation fees (PKR)
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={labelStyle}>Online</label>
                  <input type="number" min="0" className={inputClass} style={inputStyle} value={form.online_fee} onChange={(e) => setForm({ ...form, online_fee: e.target.value })} placeholder="1500" onFocus={(e) => (e.target.style.borderColor = "#CC5833")} onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={labelStyle}>In-clinic</label>
                  <input type="number" min="0" className={inputClass} style={inputStyle} value={form.physical_fee} onChange={(e) => setForm({ ...form, physical_fee: e.target.value })} placeholder="2500" onFocus={(e) => (e.target.style.borderColor = "#CC5833")} onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-wider mb-2" style={labelStyle}>Home visit (optional)</label>
                  <input type="number" min="0" className={inputClass} style={inputStyle} value={form.home_visit_fee} onChange={(e) => setForm({ ...form, home_visit_fee: e.target.value })} placeholder="Leave blank if not offered" onFocus={(e) => (e.target.style.borderColor = "#CC5833")} onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="rounded-2xl p-6 border" style={{ background: "#fff", borderColor: "rgba(204,88,51,0.08)" }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ ...labelStyle, opacity: 0.7 }}>
                About you
              </p>
              <textarea
                rows={4}
                className={inputClass}
                style={{ ...inputStyle, resize: "none" }}
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                placeholder="Briefly describe your background, approach, and areas of expertise..."
                onFocus={(e) => (e.target.style.borderColor = "#CC5833")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
              style={{ background: saving ? "rgba(204,88,51,0.5)" : "#CC5833", color: "#fff", fontFamily: "'Outfit', sans-serif" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
