import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { authService, doctorService } from "../services/services";
import {
  validateDoctorAccount,
  validateDoctorProfessional,
  validateDoctorFees,
} from "../utils/validators";

const PAKISTANI_CITIES = [
  "Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad",
  "Peshawar","Quetta","Multan","Sialkot","Gujranwala",
  "Hyderabad","Bahawalpur","Sargodha","Sukkur","Larkana",
  "Abbottabad","Mardan","Mingora","Nawabshah","Rahim Yar Khan",
];

const SPECIALTIES = [
  "General Practice","Cardiology","Dermatology","ENT",
  "Gastroenterology","Gynecology","Neurology","Oncology",
  "Ophthalmology","Orthopedics","Pediatrics","Psychiatry",
  "Pulmonology","Radiology","Urology","Nephrology",
  "Endocrinology","Rheumatology","Surgery","Internal Medicine",
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Lora:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --cream: #FAF7F2;
    --moss: #4A7C59;
    --moss-dark: #3a6147;
    --moss-light: #d4e8db;
    --clay: #C7622A;
    --clay-light: #f5e6dc;
    --dark: #1A1A1A;
    --mid: #6b6b6b;
    --border: #e0dbd4;
    --error: #c0392b;
    --error-bg: #fdf0ee;
    --gold: #d4a853;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dreg-root {
    min-height: 100vh;
    background: var(--cream);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1.25rem 5rem;
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }
  .dreg-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      radial-gradient(ellipse at 10% 50%, rgba(74,124,89,0.07) 0%, transparent 55%),
      radial-gradient(ellipse at 90% 10%, rgba(199,98,42,0.06) 0%, transparent 50%);
    pointer-events: none;
  }

  .dreg-header {
    width: 100%;
    max-width: 600px;
    margin-bottom: 1.75rem;
    animation: fadeDown 0.5s ease forwards;
  }
  @keyframes fadeDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }

  .dreg-logo {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--moss);
    letter-spacing: 0.05em;
    margin-bottom: 1.5rem;
  }

  /* 3-step track */
  .step-track {
    display: flex;
    align-items: center;
  }
  .step-item {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    position: relative;
  }
  .step-item:not(:last-child) {
    flex: 1;
  }
  .step-connector {
    flex: 1;
    height: 2px;
    background: var(--border);
    margin: 0 0.4rem;
    transition: background 0.4s;
  }
  .step-connector.done { background: var(--moss); }

  .step-bubble {
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--mid);
    transition: all 0.3s;
    flex-shrink: 0;
  }
  .step-bubble.active {
    border-color: var(--clay);
    background: var(--clay);
    color: #fff;
    box-shadow: 0 0 0 4px rgba(199,98,42,0.15);
  }
  .step-bubble.done {
    border-color: var(--moss);
    background: var(--moss);
    color: #fff;
  }
  .step-label {
    font-size: 0.74rem;
    color: var(--mid);
    display: none;
  }
  @media (min-width: 500px) { .step-label { display: block; } }
  .step-item.active .step-label { color: var(--dark); font-weight: 500; }

  /* Doctor card — slightly wider */
  .dreg-card {
    width: 100%;
    max-width: 600px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 2.25rem;
    box-shadow: 0 4px 32px rgba(26,26,26,0.07);
    animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

  .card-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--clay);
    margin-bottom: 0.4rem;
  }
  .card-title {
    font-family: 'Lora', serif;
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--dark);
    margin-bottom: 0.3rem;
  }
  .card-sub {
    font-size: 0.87rem;
    color: var(--mid);
    margin-bottom: 1.75rem;
    line-height: 1.5;
  }

  .error-banner {
    background: var(--error-bg);
    border: 1px solid #f5c6c0;
    border-left: 3px solid var(--error);
    border-radius: 8px;
    padding: 0.7rem 1rem;
    font-size: 0.875rem;
    color: var(--error);
    margin-bottom: 1.25rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; } }

  .form-row { display: grid; gap: 1rem; margin-bottom: 1rem; }
  .form-row.cols-2 { grid-template-columns: 1fr 1fr; }
  .form-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
  @media (max-width: 500px) {
    .form-row.cols-2, .form-row.cols-3 { grid-template-columns: 1fr; }
  }

  .form-group { display: flex; flex-direction: column; gap: 0.35rem; }

  .form-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--dark);
  }
  .form-label span { color: var(--clay); }
  .form-label small {
    font-weight: 400;
    color: var(--mid);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.68rem;
  }

  .form-input, .form-select, .form-textarea {
    padding: 0.72rem 0.95rem;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    color: var(--dark);
    background: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    width: 100%;
    appearance: none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--clay);
    box-shadow: 0 0 0 3px rgba(199,98,42,0.1);
  }
  .form-input.err, .form-select.err { border-color: var(--error); }
  .form-textarea { resize: vertical; min-height: 80px; }

  .field-error { font-size: 0.76rem; color: var(--error); }

  .select-wrap { position: relative; }
  .select-wrap::after {
    content: '▾';
    position: absolute; right: 0.9rem; top: 50%;
    transform: translateY(-50%);
    color: var(--mid); pointer-events: none; font-size: 0.85rem;
  }

  .password-wrap { position: relative; }
  .pass-toggle {
    position: absolute; right: 0.8rem; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--mid); display: flex; align-items: center;
    font-size: 0.9rem;
  }

  /* PKR input prefix */
  .pkr-wrap { position: relative; }
  .pkr-prefix {
    position: absolute;
    left: 0.95rem;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem;
    color: var(--mid);
    pointer-events: none;
  }
  .pkr-input { padding-left: 2.8rem !important; }

  /* Section divider */
  .section-divider {
    border-top: 1px dashed var(--border);
    margin: 1.5rem 0 1.25rem;
    padding-top: 1.25rem;
  }
  .section-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--clay);
    margin-bottom: 1rem;
  }

  /* Info note */
  .info-note {
    background: #f0f7f3;
    border: 1px solid var(--moss-light);
    border-radius: 8px;
    padding: 0.7rem 1rem;
    font-size: 0.82rem;
    color: var(--moss-dark);
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  /* Availability placeholder */
  .availability-placeholder {
    background: var(--cream);
    border: 1.5px dashed var(--border);
    border-radius: 10px;
    padding: 1.25rem;
    text-align: center;
    color: var(--mid);
    font-size: 0.85rem;
  }
  .availability-placeholder span {
    display: block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    margin-top: 0.3rem;
    color: var(--clay);
  }

  .btn-row {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.75rem;
  }

  .btn-primary {
    flex: 1;
    padding: 0.85rem;
    background: var(--clay);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .btn-primary:hover:not(:disabled) {
    background: #a85020;
    box-shadow: 0 4px 14px rgba(199,98,42,0.25);
    transform: translateY(-1px);
  }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .btn-back {
    padding: 0.85rem 1.1rem;
    background: transparent;
    color: var(--mid);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .btn-back:hover { border-color: var(--dark); color: var(--dark); }

  .spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .pending-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: #fff8ed;
    border: 1px solid #f5d98a;
    border-radius: 6px;
    padding: 0.35rem 0.75rem;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    color: #9a6c00;
    margin-top: 0.75rem;
  }
  .pending-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
`;

export default function DoctorRegister({ navigate }) {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Step 1
  const [acct, setAcct] = useState({ email: "", password: "", full_name: "", phone: "" });
  const [acctErr, setAcctErr] = useState({});

  // Step 2 (professional) — stored locally until step 3 submits
  const [prof, setProf] = useState({
    pmc_number: "", specialty: "", sub_specialty: "",
    city: "", clinic_name: "", clinic_address: "",
    years_of_experience: "", about: "",
  });
  const [profErr, setProfErr] = useState({});

  // Step 3 (fees)
  const [fees, setFees] = useState({ online_fee: "", physical_fee: "", home_visit_fee: "" });
  const [feesErr, setFeesErr] = useState({});

  const goTo = (path) => { if (navigate) navigate(path); else window.location.href = path; };

  // Warn on close if step > 1
  useEffect(() => {
    if (step < 2) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "You have unsaved registration data. Are you sure?";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [step]);

  // ── Validators ───────────────────────────────────────────────────────────────






  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleStep1 = async (e) => {
    e?.preventDefault();
    setApiError("");
    const errs = validateDoctorAccount(acct);
    if (Object.keys(errs).length) { setAcctErr(errs); return; }
    setAcctErr({});
    setLoading(true);
    try {
      const data = await authService.register({
        email: acct.email, password: acct.password,
        full_name: acct.full_name, role: "doctor",
        phone: acct.phone || undefined,
      });
      login(data);
      setStep(2);
    } catch (err) {
      if (err?.detail?.toLowerCase().includes("already")) {
        setAcctErr({ email: "Email already registered." });
      } else {
        setApiError(err?.detail || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = (e) => {
    e?.preventDefault();
    const errs = validateDoctorProfessional(prof);
    if (Object.keys(errs).length) { setProfErr(errs); return; }
    setProfErr({});
    setStep(3);
  };

  const handleStep3 = async (e) => {
    e?.preventDefault();
    setApiError("");
    const errs = validateDoctorFees(fees);
    if (Object.keys(errs).length) { setFeesErr(errs); return; }
    setFeesErr({});
    setLoading(true);

    try {
      await doctorService.registerDoctor({
        pmc_number: prof.pmc_number.toUpperCase(),
        specialty: prof.specialty,
        sub_specialty: prof.sub_specialty || undefined,
        city: prof.city,
        clinic_name: prof.clinic_name || undefined,
        clinic_address: prof.clinic_address || undefined,
        years_of_experience: prof.years_of_experience ? Number(prof.years_of_experience) : undefined,
        about: prof.about || undefined,
        online_fee: Number(fees.online_fee),
        physical_fee: Number(fees.physical_fee),
        home_visit_fee: fees.home_visit_fee ? Number(fees.home_visit_fee) : undefined,
      });
      // Success: redirect with review banner
      sessionStorage.setItem("doctor_review_banner", "1");
      goTo("/doctor/dashboard");
    } catch (err) {
      // Token preserved; allow retry
      setApiError(err?.detail || "Profile submission failed. Your account is saved — you can retry.");
    } finally {
      setLoading(false);
    }
  };

  const setA = (f) => (e) => { setAcct(a => ({ ...a, [f]: e.target.value })); if (acctErr[f]) setAcctErr(x => ({ ...x, [f]: "" })); };
  const setF = (f) => (e) => { setFees(a => ({ ...a, [f]: e.target.value })); if (feesErr[f]) setFeesErr(x => ({ ...x, [f]: "" })); };
  const setP = (f) => (e) => { setProf(a => ({ ...a, [f]: e.target.value })); if (profErr[f]) setProfErr(x => ({ ...x, [f]: "" })); };

  const steps = [["01","Account"],["02","Practice"],["03","Fees"]];

  return (
    <>
      <style>{css}</style>
      <div className="dreg-root">
        <div className="dreg-header">
          <div className="dreg-logo">
            ✦ SYNC<span style={{ color: "var(--clay)" }}>HEALTH</span>
            <span style={{ marginLeft: "0.75rem", fontWeight: 400, color: "var(--mid)", fontSize: "0.75rem" }}>
              · Doctor Registration
            </span>
          </div>

          {/* 3-step indicator */}
          <div className="step-track">
            {steps.map(([num, label], i) => {
              const idx = i + 1;
              const cls = step > idx ? "done" : step === idx ? "active" : "";
              return (
                <div key={idx} className={`step-item${step === idx ? " active" : ""}`} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                  <div className={`step-bubble ${cls}`}>{step > idx ? "✓" : num}</div>
                  <span className="step-label" style={{ marginLeft: "0.4rem" }}>{label}</span>
                  {i < 2 && <div className={`step-connector${step > idx ? " done" : ""}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="dreg-card">
          {/* ── STEP 1: Account ─────────────────────────────────────────────── */}
          {step === 1 && (
            <>
              <p className="card-eyebrow">Step 1 of 3</p>
              <h2 className="card-title">Create your account</h2>
              <p className="card-sub">Start your doctor profile — takes about 3 minutes.</p>

              {apiError && <div className="error-banner">⚠ {apiError}</div>}

              <form onSubmit={handleStep1} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="d_name">Full Name <span>*</span></label>
                    <input id="d_name" type="text" className={`form-input${acctErr.full_name ? " err" : ""}`}
                      placeholder="Dr. Hamza Sheikh" value={acct.full_name} onChange={setA("full_name")} />
                    {acctErr.full_name && <span className="field-error">{acctErr.full_name}</span>}
                  </div>
                </div>

                <div className="form-row cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="d_email">Email <span>*</span></label>
                    <input id="d_email" type="email" className={`form-input${acctErr.email ? " err" : ""}`}
                      placeholder="doctor@example.com" value={acct.email} onChange={setA("email")} autoComplete="email" />
                    {acctErr.email && <span className="field-error">{acctErr.email}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="d_phone">Phone</label>
                    <input id="d_phone" type="tel" className={`form-input${acctErr.phone ? " err" : ""}`}
                      placeholder="+923451234567" value={acct.phone} onChange={setA("phone")} />
                    {acctErr.phone && <span className="field-error">{acctErr.phone}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="d_pass">Password <span>*</span></label>
                    <div className="password-wrap">
                      <input id="d_pass" type={showPass ? "text" : "password"}
                        className={`form-input${acctErr.password ? " err" : ""}`}
                        placeholder="Min 8 characters" value={acct.password} onChange={setA("password")} />
                      <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)} tabIndex={-1}>
                        {showPass ? "🙈" : "👁"}
                      </button>
                    </div>
                    {acctErr.password && <span className="field-error">{acctErr.password}</span>}
                  </div>
                </div>

                <div className="btn-row">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <><span className="spinner" /> Creating…</> : "Continue →"}
                  </button>
                </div>

                <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--mid)", marginTop: "1rem" }}>
                  Already registered? <a href="/login" onClick={(e) => { e.preventDefault(); goTo("/login"); }}
                    style={{ color: "var(--clay)", textDecoration: "none", fontWeight: 500 }}>Sign in</a>
                </p>
              </form>
            </>
          )}

          {/* ── STEP 2: Professional Details ────────────────────────────────── */}
          {step === 2 && (
            <>
              <p className="card-eyebrow">Step 2 of 3</p>
              <h2 className="card-title">Professional details</h2>
              <p className="card-sub">Your medical credentials and practice information.</p>

              <form onSubmit={handleStep2} noValidate>
                <div className="form-row cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="pmc">
                      PMC Number <span>*</span>
                      <small style={{ marginLeft: "0.4rem" }}>e.g. PMC-12345</small>
                    </label>
                    <input id="pmc" type="text" className={`form-input${profErr.pmc_number ? " err" : ""}`}
                      placeholder="PMC-12345" value={prof.pmc_number}
                      onChange={(e) => { setProf(p => ({ ...p, pmc_number: e.target.value.toUpperCase() })); if (profErr.pmc_number) setProfErr(x => ({ ...x, pmc_number: "" })); }}
                      style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.05em" }} />
                    {profErr.pmc_number && <span className="field-error">{profErr.pmc_number}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="exp">Years of Experience</label>
                    <input id="exp" type="number" min="0" max="50" className={`form-input${profErr.years_of_experience ? " err" : ""}`}
                      placeholder="10" value={prof.years_of_experience} onChange={setP("years_of_experience")} />
                    {profErr.years_of_experience && <span className="field-error">{profErr.years_of_experience}</span>}
                  </div>
                </div>

                <div className="form-row cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="spec">Specialty <span>*</span></label>
                    <div className="select-wrap">
                      <select id="spec" className={`form-select${profErr.specialty ? " err" : ""}`}
                        value={prof.specialty} onChange={setP("specialty")}>
                        <option value="">Select…</option>
                        {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    {profErr.specialty && <span className="field-error">{profErr.specialty}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="subspec">Sub-specialty</label>
                    <input id="subspec" type="text" className="form-input"
                      placeholder="e.g. Interventional" value={prof.sub_specialty} onChange={setP("sub_specialty")} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="dcity">City <span>*</span></label>
                    <div className="select-wrap">
                      <select id="dcity" className={`form-select${profErr.city ? " err" : ""}`}
                        value={prof.city} onChange={setP("city")}>
                        <option value="">Select city…</option>
                        {PAKISTANI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {profErr.city && <span className="field-error">{profErr.city}</span>}
                  </div>
                </div>

                <div className="section-divider">
                  <p className="section-label">Clinic Information <span style={{ fontWeight: 300, color: "var(--mid)" }}>(optional)</span></p>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="clinic">Clinic Name</label>
                      <input id="clinic" type="text" className="form-input"
                        placeholder="Sheikh Heart Clinic" value={prof.clinic_name} onChange={setP("clinic_name")} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="caddr">Clinic Address</label>
                      <input id="caddr" type="text" className="form-input"
                        placeholder="Block 5, Clifton, Karachi" value={prof.clinic_address} onChange={setP("clinic_address")} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="about">About / Bio</label>
                      <textarea id="about" className="form-textarea"
                        placeholder="Brief professional summary…" value={prof.about} onChange={setP("about")} />
                    </div>
                  </div>
                </div>

                <div className="btn-row">
                  <button type="button" className="btn-back" onClick={() => setStep(1)}>← Back</button>
                  <button type="submit" className="btn-primary">Continue →</button>
                </div>
              </form>
            </>
          )}

          {/* ── STEP 3: Fees & Availability ──────────────────────────────────── */}
          {step === 3 && (
            <>
              <p className="card-eyebrow">Step 3 of 3</p>
              <h2 className="card-title">Fees & Availability</h2>
              <p className="card-sub">Set your consultation fees in PKR.</p>

              {apiError && <div className="error-banner">⚠ {apiError}</div>}

              <form onSubmit={handleStep3} noValidate>
                <div className="info-note">
                  ℹ️ Fees are shown to patients and billed in PKR. Minimum fee is Rs. 100.
                </div>

                <div className="form-row cols-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="ofee">Online Fee <span>*</span></label>
                    <div className="pkr-wrap">
                      <span className="pkr-prefix">PKR</span>
                      <input id="ofee" type="number" min="100"
                        className={`form-input pkr-input${feesErr.online_fee ? " err" : ""}`}
                        placeholder="1500" value={fees.online_fee} onChange={setF("online_fee")} />
                    </div>
                    {feesErr.online_fee && <span className="field-error">{feesErr.online_fee}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="pfee">Physical Fee <span>*</span></label>
                    <div className="pkr-wrap">
                      <span className="pkr-prefix">PKR</span>
                      <input id="pfee" type="number" min="100"
                        className={`form-input pkr-input${feesErr.physical_fee ? " err" : ""}`}
                        placeholder="3000" value={fees.physical_fee} onChange={setF("physical_fee")} />
                    </div>
                    {feesErr.physical_fee && <span className="field-error">{feesErr.physical_fee}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="hfee">Home Visit <small>(optional)</small></label>
                    <div className="pkr-wrap">
                      <span className="pkr-prefix">PKR</span>
                      <input id="hfee" type="number" min="100"
                        className={`form-input pkr-input${feesErr.home_visit_fee ? " err" : ""}`}
                        placeholder="5000" value={fees.home_visit_fee} onChange={setF("home_visit_fee")} />
                    </div>
                    {feesErr.home_visit_fee && <span className="field-error">{feesErr.home_visit_fee}</span>}
                  </div>
                </div>

                <div className="section-divider">
                  <p className="section-label">Availability</p>
                  <div className="availability-placeholder">
                    📅 Schedule setup will be available after profile verification.
                    <span>POST /api/v1/doctors/availability — coming Phase 1</span>
                  </div>
                </div>

                <div className="btn-row">
                  <button type="button" className="btn-back" onClick={() => setStep(2)}>← Back</button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <><span className="spinner" /> Submitting…</> : "Submit Profile →"}
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div className="pending-badge">
                    <span className="pending-dot" />
                    Profile will be reviewed before going live
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
