import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { patientService } from "../services/patientService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad"];

export default function PatientProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    age: "", gender: "", city: "", emergency_contact_name: "", emergency_contact_phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("sync_auth");
    patientService.getProfile(token)
      .then((data) => setProfile({ age: data.age || "", gender: data.gender || "", city: data.city || "", emergency_contact_name: data.emergency_contact_name || "", emergency_contact_phone: data.emergency_contact_phone || "" }))
      .catch(() => {})
      .finally(() => setLoading(false));

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
    try {
      const token = localStorage.getItem("sync_auth");
      await patientService.updateProfile({ ...profile, age: Number(profile.age) }, token);
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

  return (
    <div className="min-h-screen hex-bg">
      <Navbar />
      <div className="pt-28 pb-16 px-4" ref={containerRef}>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
              My account
            </p>
            <h1 className="text-3xl font-bold" style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}>
              Profile settings
            </h1>
          </div>

          {/* Account info (read-only) */}
          <div className="rounded-2xl p-6 border mb-5" style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
              Account info
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs mb-1" style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'IBM Plex Mono', monospace" }}>Full name</p>
                <p className="text-sm font-medium" style={{ color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" }}>{user?.full_name || "—"}</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'IBM Plex Mono', monospace" }}>Email</p>
                <p className="text-sm font-medium" style={{ color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" }}>{user?.email || "—"}</p>
              </div>
            </div>
          </div>

          {/* Editable profile */}
          <div className="rounded-2xl p-6 border" style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}>
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
              Health profile
            </p>

            {success && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(46,64,54,0.08)", color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}>
                Profile updated successfully.
              </div>
            )}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(204,88,51,0.08)", color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#2E4036", borderTopColor: "transparent" }} />
              </div>
            ) : (
              <form onSubmit={handleSave} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>Age</label>
                    <input type="number" min="1" max="120" className={inputClass} style={inputStyle} value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} placeholder="25" onFocus={(e) => (e.target.style.borderColor = "#2E4036")} onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>Gender</label>
                    <select className={inputClass} style={inputStyle} value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>City</label>
                  <select className={inputClass} style={inputStyle} value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })}>
                    <option value="">Select city</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="rounded-xl p-4" style={{ background: "rgba(46,64,54,0.04)", border: "1px solid rgba(46,64,54,0.08)" }}>
                  <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>Emergency contact</p>
                  <div className="flex flex-col gap-3">
                    <input type="text" className={inputClass} style={inputStyle} value={profile.emergency_contact_name} onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })} placeholder="Contact name" onFocus={(e) => (e.target.style.borderColor = "#2E4036")} onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                    <input type="tel" className={inputClass} style={inputStyle} value={profile.emergency_contact_phone} onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })} placeholder="+92 300 0000000" onFocus={(e) => (e.target.style.borderColor = "#2E4036")} onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                  style={{ background: saving ? "rgba(46,64,54,0.5)" : "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif" }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
