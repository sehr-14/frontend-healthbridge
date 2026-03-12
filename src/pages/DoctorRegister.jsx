import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { doctorService } from "../services/doctorService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HOME_URL = "https://landing-page-sync.vercel.app";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad", "Gujranwala", "Bahawalpur", "Sargodha", "Sukkur"];
const SPECIALTIES = ["General Physician", "Cardiologist", "Dermatologist", "Neurologist", "Orthopedic Surgeon", "Gynecologist", "Pediatrician", "Psychiatrist", "Ophthalmologist", "ENT Specialist", "Urologist", "Oncologist", "Gastroenterologist", "Pulmonologist", "Endocrinologist", "Rheumatologist", "Nephrologist", "Radiologist", "Pathologist", "Dentist"];
const STEPS = ["Account", "Professional Info", "Fees"];

export default function DoctorRegister() {
  const [step, setStep] = useState(1);
  const [accountData, setAccountData] = useState({ full_name: "", email: "", password: "", phone: "" });
  const [profData, setProfData] = useState({ pmc_number: "", specialty: "", sub_specialty: "", city: "", clinic_name: "", clinic_address: "", years_of_experience: "" });
  const [feeData, setFeeData] = useState({ online_fee: "", physical_fee: "", home_visit_fee: "", about: "" });
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
      const data = await authService.register({ ...accountData, role: "doctor" });
      login(data);
      setStep(2);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    setError("");
    if (!profData.pmc_number.trim()) { setError("PMC number is required."); return; }
    setStep(3);
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    setError("");
    if (!feeData.online_fee || !feeData.physical_fee) { setError("Both online and in-clinic fees are required."); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("sync_auth");
      await doctorService.registerDoctor({
        ...profData, ...feeData,
        online_fee: Number(feeData.online_fee),
        physical_fee: Number(feeData.physical_fee),
        home_visit_fee: feeData.home_visit_fee ? Number(feeData.home_visit_fee) : undefined,
        years_of_experience: profData.years_of_experience ? Number(profData.years_of_experience) : undefined,
      }, token);
      navigate("/doctor/dashboard");
    } catch (err) { setError(err.message + " Your account was created. Update profile later."); }
    finally { setLoading(false); }
  };

  const inputStyle = { borderColor: "rgba(46,64,54,0.15)", background: "#F2F0E9", color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" };
  const inputClass = "w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 text-sm";
  const fo = (e) => (e.target.style.borderColor = "#CC5833");
  const fb = (e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)");

  return (
    <div className="min-h-screen hex-bg flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center page-wide pt-28 pb-16">
        <div ref={formRef} className="w-full max-w-lg">

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
              style={{ color: "#CC5833", opacity: 0.8, fontFamily: "'IBM Plex Mono', monospace" }}>
              Provider registration
            </p>
            <h1 className="text-4xl font-bold mb-2"
              style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.025em" }}>
              Join as a{" "}
              <em style={{ color: "#CC5833", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>doctor</em>
            </h1>
            <p className="text-sm" style={{ color: "#1A1A1A", opacity: 0.5, fontFamily: "'Outfit', sans-serif" }}>
              Complete your profile to start seeing patients.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{ background: step >= i + 1 ? "#CC5833" : "rgba(204,88,51,0.1)", color: step >= i + 1 ? "#fff" : "rgba(204,88,51,0.4)", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span className="text-xs hidden sm:block"
                    style={{ color: step === i + 1 ? "#CC5833" : "rgba(26,26,26,0.4)", fontFamily: "'Outfit', sans-serif", fontWeight: step === i + 1 ? 600 : 400 }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && <div className="w-6 sm:w-8 h-px" style={{ background: "rgba(204,88,51,0.15)" }} />}
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-8 border"
            style={{ background: "#fff", borderColor: "rgba(204,88,51,0.08)", boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(204,88,51,0.08)", color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}>
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleStep1} className="flex flex-col gap-5">
                {[
                  { label: "Full name", type: "text", key: "full_name", ph: "Dr. Ayesha Khan" },
                  { label: "Email address", type: "email", key: "email", ph: "doctor@hospital.com" },
                  { label: "Phone", type: "tel", key: "phone", ph: "+92 300 0000000", req: false },
                  { label: "Password", type: "password", key: "password", ph: "Min. 8 characters" },
                ].map(({ label, type, key, ph, req = true }) => (
                  <div key={key}>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" }}>{label}</label>
                    <input type={type} required={req} className={inputClass} style={inputStyle}
                      value={accountData[key]} onChange={(e) => setAccountData({ ...accountData, [key]: e.target.value })}
                      placeholder={ph} onFocus={fo} onBlur={fb} />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] mt-2"
                  style={{ background: loading ? "rgba(204,88,51,0.5)" : "#CC5833", color: "#fff", fontFamily: "'Outfit', sans-serif" }}>
                  {loading ? "Creating account..." : "Continue →"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleStep2} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" }}>PMC License Number *</label>
                    <input type="text" required className={inputClass} style={inputStyle}
                      value={profData.pmc_number} onChange={(e) => setProfData({ ...profData, pmc_number: e.target.value.toUpperCase() })}
                      placeholder="PMC-XXXXX" onFocus={fo} onBlur={fb} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" }}>Specialty *</label>
                    <select required className={inputClass} style={inputStyle}
                      value={profData.specialty} onChange={(e) => setProfData({ ...profData, specialty: e.target.value })}>
                      <option value="">Select specialty</option>
                      {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" }}>Sub-specialty</label>
                    <input type="text" className={inputClass} style={inputStyle}
                      value={profData.sub_specialty} onChange={(e) => setProfData({ ...profData, sub_specialty: e.target.value })}
                      placeholder="Optional" onFocus={fo} onBlur={fb} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" }}>City *</label>
                    <select required className={inputClass} style={inputStyle}
                      value={profData.city} onChange={(e) => setProfData({ ...profData, city: e.target.value })}>
                      <option value="">Select city</option>
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" }}>Experience (yrs)</label>
                    <input type="number" min="0" max="60" className={inputClass} style={inputStyle}
                      value={profData.years_of_experience} onChange={(e) => setProfData({ ...profData, years_of_experience: e.target.value })}
                      placeholder="10" onFocus={fo} onBlur={fb} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" }}>Clinic / Hospital</label>
                    <input type="text" className={inputClass} style={inputStyle}
                      value={profData.clinic_name} onChange={(e) => setProfData({ ...profData, clinic_name: e.target.value })}
                      placeholder="City Hospital, Lahore" onFocus={fo} onBlur={fb} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" }}>Clinic address</label>
                    <input type="text" className={inputClass} style={inputStyle}
                      value={profData.clinic_address} onChange={(e) => setProfData({ ...profData, clinic_address: e.target.value })}
                      placeholder="Street, Area" onFocus={fo} onBlur={fb} />
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
                    style={{ background: "rgba(204,88,51,0.08)", color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}>Back</button>
                  <button type="submit"
                    className="flex-[2] py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                    style={{ background: "#CC5833", color: "#fff", fontFamily: "'Outfit', sans-serif" }}>Continue →</button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleStep3} className="flex flex-col gap-5">
                <p className="text-xs" style={{ color: "#1A1A1A", opacity: 0.5, fontFamily: "'Outfit', sans-serif" }}>
                  Set consultation fees in PKR. You can update these from your dashboard later.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" }}>Online fee (PKR) *</label>
                    <input type="number" required min="0" className={inputClass} style={inputStyle}
                      value={feeData.online_fee} onChange={(e) => setFeeData({ ...feeData, online_fee: e.target.value })}
                      placeholder="1500" onFocus={fo} onBlur={fb} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" }}>In-clinic fee (PKR) *</label>
                    <input type="number" required min="0" className={inputClass} style={inputStyle}
                      value={feeData.physical_fee} onChange={(e) => setFeeData({ ...feeData, physical_fee: e.target.value })}
                      placeholder="2500" onFocus={fo} onBlur={fb} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" }}>Home visit fee (optional)</label>
                    <input type="number" min="0" className={inputClass} style={inputStyle}
                      value={feeData.home_visit_fee} onChange={(e) => setFeeData({ ...feeData, home_visit_fee: e.target.value })}
                      placeholder="Leave blank if not offered" onFocus={fo} onBlur={fb} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "#CC5833", fontFamily: "'IBM Plex Mono', monospace" }}>About you</label>
                    <textarea rows={3} className={inputClass} style={{ ...inputStyle, resize: "none" }}
                      value={feeData.about} onChange={(e) => setFeeData({ ...feeData, about: e.target.value })}
                      placeholder="Brief professional bio..." onFocus={fo} onBlur={fb} />
                  </div>
                </div>
                <div className="rounded-xl px-4 py-3" style={{ background: "rgba(46,64,54,0.04)", border: "1px solid rgba(46,64,54,0.08)" }}>
                  <p className="text-xs" style={{ color: "#1A1A1A", opacity: 0.6, fontFamily: "'Outfit', sans-serif" }}>
                    <span style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>NOTE </span>
                    Your profile will be under review after registration. You can accept appointments once verified.
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
                    style={{ background: "rgba(204,88,51,0.08)", color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}>Back</button>
                  <button type="submit" disabled={loading}
                    className="flex-[2] py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                    style={{ background: loading ? "rgba(204,88,51,0.5)" : "#CC5833", color: "#fff", fontFamily: "'Outfit', sans-serif" }}>
                    {loading ? "Submitting..." : "Complete Registration"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p className="text-center mt-5 text-sm" style={{ color: "#1A1A1A", opacity: 0.5, fontFamily: "'Outfit', sans-serif" }}>
            Already registered?{" "}
            <Link to="/login" className="font-semibold underline underline-offset-2" style={{ color: "#CC5833" }}>Sign in</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
