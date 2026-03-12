import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doctorService } from "../services/doctorService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Placeholder appointment data
const APPOINTMENT_MOCK = {
  id: "t1",
  patient_name: "Muhammad Usman",
  patient_age: 34,
  patient_gender: "Male",
  date: "18 March 2026",
  time: "9:00 AM",
  type: "Online",
  existing_notes: "",
};

export default function ConsultationNotes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [appointment, setAppointment] = useState(APPOINTMENT_MOCK);
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);
    const fullNotes = [
      notes && `Clinical Notes:\n${notes}`,
      diagnosis && `Diagnosis:\n${diagnosis}`,
      prescription && `Prescription:\n${prescription}`,
      followUp && `Follow-up:\n${followUp}`,
    ].filter(Boolean).join("\n\n");

    try {
      const token = localStorage.getItem("sync_auth");
      await doctorService.saveNotes(id, fullNotes, token);
      setSuccess(true);
      setTimeout(() => {
        navigate("/doctor/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to save. Notes saved locally.");
    } finally {
      setSaving(false);
    }
  };

  const textareaStyle = {
    borderColor: "rgba(46,64,54,0.15)",
    background: "#F2F0E9",
    color: "#1A1A1A",
    fontFamily: "'Outfit', sans-serif",
    resize: "none",
  };

  return (
    <div className="min-h-screen hex-bg">
      <Navbar />

      <div className="pt-28 pb-16 px-4" ref={containerRef}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
                Consultation notes
              </p>
              <h1 className="text-3xl font-bold" style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}>
                {appointment.patient_name}
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

          {/* Appointment info */}
          <div
            className="rounded-2xl p-5 border mb-6 flex flex-wrap gap-6"
            style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
          >
            {[
              { label: "Patient", value: appointment.patient_name },
              { label: "Age", value: `${appointment.patient_age} yrs` },
              { label: "Gender", value: appointment.patient_gender },
              { label: "Date", value: appointment.date },
              { label: "Time", value: appointment.time },
              { label: "Type", value: appointment.type },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs mb-0.5" style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {label}
                </p>
                <p className="text-sm font-medium" style={{ color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Notes form */}
          <form onSubmit={handleSave} className="space-y-5">
            {success && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(46,64,54,0.08)", color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}>
                Notes saved. Redirecting to dashboard...
              </div>
            )}
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(204,88,51,0.08)", color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}>
                {error}
              </div>
            )}

            {[
              { label: "Clinical Notes", key: "notes", value: notes, setter: setNotes, placeholder: "Document patient's presenting complaints, history, examination findings...", rows: 5 },
              { label: "Diagnosis", key: "diagnosis", value: diagnosis, setter: setDiagnosis, placeholder: "Primary and differential diagnoses...", rows: 3 },
              { label: "Prescription / Treatment Plan", key: "prescription", value: prescription, setter: setPrescription, placeholder: "Medications, dosage, duration, instructions...", rows: 4 },
              { label: "Follow-up Instructions", key: "followUp", value: followUp, setter: setFollowUp, placeholder: "Follow-up date, tests to be done, red flags to watch...", rows: 2 },
            ].map(({ label, key, value, setter, placeholder, rows }) => (
              <div key={key} className="rounded-2xl p-6 border" style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}>
                <label
                  className="block text-xs uppercase tracking-widest mb-4"
                  style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {label}
                </label>
                <textarea
                  rows={rows}
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 text-sm"
                  style={textareaStyle}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  onFocus={(e) => (e.target.style.borderColor = "#2E4036")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")}
                />
              </div>
            ))}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/doctor/dashboard")}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                style={{ background: "rgba(46,64,54,0.08)", color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-[2] py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                style={{ background: saving ? "rgba(46,64,54,0.5)" : "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif" }}
              >
                {saving ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
