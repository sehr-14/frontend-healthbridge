import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { patientService } from "../services/patientService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HOME_URL = "https://landing-page-sync.vercel.app";

const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad",
  "Gujranwala", "Bahawalpur", "Sargodha", "Sukkur", "Larkana",
];

const STEPS = ["Account", "Profile"];

export default function PatientRegister() {
  const [step, setStep] = useState(1);
  const [accountData, setAccountData] = useState({ full_name: "", email: "", password: "", phone: "" });
  const [profileData, setProfileData] = useState({ age: "", gender: "", city: "", emergency_contact_name: "", emergency_contact_phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (formRef.current) {
      formRef.current.style.opacity = "0";
      formRef.current.style.transform = "translateY(28px)";
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.style.transition = "all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)";
          formRef.current.style.opacity = "1";
          formRef.current.style.transform = "translateY(0)";
        }
      }, 80);
    }
  }, []);

  const handleStep1 = async (e) => {
    e.preventDefault();
    setError("");
    if (accountData.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const data = await authService.register({ ...accountData, role: "patient" });
      login(data);
      setStep(2);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await patientService.updateProfile({ ...profileData, age: Number(profileData.age) }, localStorage.getItem("sync_auth"));
      navigate("/patient/dashboard");
    } catch (err) { setError(err.message + " You can retry or continue later."); }
    finally { setLoading(false); }
  };

  const inputStyle = { borderColor: "rgba(46,64,54,0.15)", background: "#F2F0E9", color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" };
  const inputClass = "w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 text-sm";

  return (
    <div className="min-h-screen hex-bg flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center page-wide pt-28 pb-16">
        <div ref={formRef} className="w-full max-w-md">

          {/* Back to Home */}
          <a href={HOME_URL}
            className="inline-flex items-center gap-1.5 text-sm mb-8 transition-all duration-200 hover:opacity-60 hover:-translate-x-1"
            style={{ color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </a>

          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-widest mb-3"
              style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
              Patient registration
            </p>
            <h1 className="text-4xl font-bold mb-2"
              style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.025em" }}>
              Create your{" "}
              <em style={{ color: "#2E4036", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>account</em>
            </h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{ background: step >= i + 1 ? "#2E4036" : "rgba(46,64,54,0.1)", color: step >= i + 1 ? "#F2F0E9" : "rgba(46,64,54,0.4)", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span className="text-xs" style={{ color: step === i + 1 ? "#2E4036" : "rgba(26,26,26,0.4)", fontFamily: "'Outfit', sans-serif", fontWeight: step === i + 1 ? 600 : 400 }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && <div className="w-8 h-px" style={{ background: "rgba(46,64,54,0.15)" }} />}
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-8 border"
            style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)", boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(204,88,51,0.08)", color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}>
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleStep1} className="flex flex-col gap-5">
                {[
                  { label: "Full name", type: "text", key: "full_name", ph: "Muhammad Ali" },
                  { label: "Email address", type: "email", key: "email", ph: "you@example.com" },
                  { label: "Phone (optional)", type: "tel", key: "phone", ph: "+92 300 0000000", req: false },
                  { label: "Password", type: "password", key: "password", ph: "Min. 8 characters" },
                ].map(({ label, type, key, ph, req = true }) => (
                  <div key={key}>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>{label}</label>
                    <input type={type} required={req} className={inputClass} style={inputStyle}
                      value={accountData[key]} onChange={(e) => setAccountData({ ...accountData, [key]: e.target.value })}
                      placeholder={ph}
                      onFocus={(e) => (e.target.style.borderColor = "#2E4036")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] mt-2"
                  style={{ background: loading ? "rgba(46,64,54,0.5)" : "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif" }}>
                  {loading ? "Creating account..." : "Continue →"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleStep2} className="flex flex-col gap-5">
                <p className="text-sm" style={{ color: "#1A1A1A", opacity: 0.6, fontFamily: "'Outfit', sans-serif" }}>
                  Help us personalize your experience with a few details.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>Age</label>
                    <input type="number" required min="1" max="120" className={inputClass} style={inputStyle}
                      value={profileData.age} onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                      placeholder="25"
                      onFocus={(e) => (e.target.style.borderColor = "#2E4036")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>Gender</label>
                    <select required className={inputClass} style={inputStyle}
                      value={profileData.gender} onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}>
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>City</label>
                  <select required className={inputClass} style={inputStyle}
                    value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}>
                    <option value="">Select your city</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(46,64,54,0.04)", border: "1px solid rgba(46,64,54,0.08)" }}>
                  <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>Emergency contact</p>
                  <div className="flex flex-col gap-3">
                    <input type="text" required className={inputClass} style={inputStyle}
                      value={profileData.emergency_contact_name} onChange={(e) => setProfileData({ ...profileData, emergency_contact_name: e.target.value })}
                      placeholder="Contact name"
                      onFocus={(e) => (e.target.style.borderColor = "#2E4036")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                    <input type="tel" required className={inputClass} style={inputStyle}
                      value={profileData.emergency_contact_phone} onChange={(e) => setProfileData({ ...profileData, emergency_contact_phone: e.target.value })}
                      placeholder="+92 300 0000000"
                      onFocus={(e) => (e.target.style.borderColor = "#2E4036")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")} />
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                    style={{ background: "rgba(46,64,54,0.08)", color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}>
                    Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-[2] py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                    style={{ background: loading ? "rgba(46,64,54,0.5)" : "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif" }}>
                    {loading ? "Saving..." : "Finish Onboarding"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p className="text-center mt-5 text-sm" style={{ color: "#1A1A1A", opacity: 0.5, fontFamily: "'Outfit', sans-serif" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold underline underline-offset-2" style={{ color: "#2E4036" }}>Sign in</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
