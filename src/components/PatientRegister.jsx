import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService, patientService } from "../services/services";
import {
  validatePatientAccount,
  validatePatientProfile,
  passwordStrength,
  STRENGTH_LABEL,
  STRENGTH_COLOR,
} from "../utils/validators";

const PAKISTANI_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Peshawar", "Quetta", "Multan", "Sialkot", "Gujranwala",
  "Hyderabad", "Bahawalpur", "Sargodha", "Sukkur", "Larkana",
  "Abbottabad", "Mardan", "Mingora", "Nawabshah", "Rahim Yar Khan",
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
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .reg-root {
    min-height: 100vh;
    background: var(--cream);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1.25rem 4rem;
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }

  /* Subtle background pattern */
  .reg-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: radial-gradient(circle at 20% 20%, rgba(74,124,89,0.06) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(199,98,42,0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  .reg-header {
    width: 100%;
    max-width: 540px;
    margin-bottom: 2rem;
    animation: fadeDown 0.5s ease forwards;
  }
  @keyframes fadeDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }

  .reg-logo {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--moss);
    letter-spacing: 0.05em;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  /* Step indicator */
  .step-track {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 2rem;
  }
  .step-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    position: relative;
  }
  .step-item:not(:last-child)::after {
    content: '';
    flex: 1;
    height: 2px;
    background: var(--border);
    margin: 0 0.5rem;
    transition: background 0.4s;
  }
  .step-item.completed:not(:last-child)::after { background: var(--moss); }

  .step-bubble {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--mid);
    transition: all 0.3s;
    flex-shrink: 0;
  }
  .step-bubble.active {
    border-color: var(--moss);
    background: var(--moss);
    color: #fff;
    box-shadow: 0 0 0 4px rgba(74,124,89,0.15);
  }
  .step-bubble.done {
    border-color: var(--moss);
    background: var(--moss);
    color: #fff;
  }
  .step-label {
    font-size: 0.78rem;
    color: var(--mid);
    white-space: nowrap;
    display: none;
  }
  @media (min-width: 480px) { .step-label { display: block; } }
  .step-item.active .step-label { color: var(--dark); font-weight: 500; }

  /* Card */
  .reg-card {
    width: 100%;
    max-width: 540px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 2.25rem;
    box-shadow: 0 2px 24px rgba(26,26,26,0.06);
    animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

  .card-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--moss);
    margin-bottom: 0.5rem;
  }

  .card-title {
    font-family: 'Lora', serif;
    font-size: 1.65rem;
    font-weight: 500;
    color: var(--dark);
    margin-bottom: 0.35rem;
  }

  .card-sub {
    font-size: 0.88rem;
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
    align-items: center;
    gap: 0.5rem;
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; } }

  .form-row {
    display: grid;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .form-row.cols-2 { grid-template-columns: 1fr 1fr; }
  @media (max-width: 480px) { .form-row.cols-2 { grid-template-columns: 1fr; } }

  .form-group { display: flex; flex-direction: column; gap: 0.35rem; }

  .form-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--dark);
    letter-spacing: 0.01em;
  }
  .form-label span { color: var(--clay); }

  .form-input, .form-select {
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
  .form-input:focus, .form-select:focus {
    border-color: var(--moss);
    box-shadow: 0 0 0 3px rgba(74,124,89,0.1);
  }
  .form-input.err { border-color: var(--error); }
  .field-error { font-size: 0.76rem; color: var(--error); }

  .password-wrap { position: relative; }
  .pass-toggle {
    position: absolute; right: 0.8rem; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--mid); display: flex; align-items: center;
  }
  .pass-toggle:hover { color: var(--dark); }

  .select-wrap { position: relative; }
  .select-wrap::after {
    content: '▾';
    position: absolute;
    right: 0.95rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--mid);
    pointer-events: none;
    font-size: 0.85rem;
  }

  .password-strength {
    display: flex;
    gap: 3px;
    margin-top: 0.4rem;
  }
  .strength-bar {
    flex: 1; height: 3px; border-radius: 3px;
    background: var(--border);
    transition: background 0.3s;
  }
  .strength-bar.weak { background: var(--error); }
  .strength-bar.medium { background: #e5a623; }
  .strength-bar.strong { background: var(--moss); }

  .btn-row {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .btn-primary {
    flex: 1;
    padding: 0.85rem;
    background: var(--moss);
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
    background: var(--moss-dark);
    box-shadow: 0 4px 14px rgba(74,124,89,0.25);
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

  .signin-link {
    text-align: center;
    font-size: 0.82rem;
    color: var(--mid);
    margin-top: 1.25rem;
  }
  .signin-link a {
    color: var(--moss);
    text-decoration: none;
    font-weight: 500;
  }
  .signin-link a:hover { text-decoration: underline; }
`;

export default function PatientRegister({ navigate }) {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Step 1 state
  const [acct, setAcct] = useState({ email: "", password: "", full_name: "", phone: "" });
  const [acctErrors, setAcctErrors] = useState({});

  // Step 2 state
  const [profile, setProfile] = useState({ age: "", gender: "", city: "", emergency_contact_name: "", emergency_contact_phone: "" });
  const [profErrors, setProfErrors] = useState({});

  const goTo = (path) => { if (navigate) navigate(path); else window.location.href = path; };

  // ── Step 1 Submit ────────────────────────────────────────────────────────────
  const handleStep1 = async (e) => {
    e?.preventDefault();
    setApiError("");
    const errs = validatePatientAccount(acct);
    if (Object.keys(errs).length) { setAcctErrors(errs); return; }
    setAcctErrors({});
    setLoading(true);

    try {
      const data = await authService.register({
        email: acct.email,
        password: acct.password,
        full_name: acct.full_name,
        role: "patient",
        phone: acct.phone || undefined,
      });
      login(data); // token + user saved to localStorage & context
      setStep(2);
    } catch (err) {
      if (err?.detail?.toLowerCase().includes("already")) {
        setAcctErrors({ email: "This email is already registered." });
      } else {
        setApiError(err?.detail || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2 Submit ────────────────────────────────────────────────────────────
  const handleStep2 = async (e) => {
    e?.preventDefault();
    setApiError("");
    const errs = validatePatientProfile(profile);
    if (Object.keys(errs).length) { setProfErrors(errs); return; }
    setProfErrors({});
    setLoading(true);

    try {
      await patientService.updateProfile({
        age: Number(profile.age),
        gender: profile.gender,
        city: profile.city,
        emergency_contact_name: profile.emergency_contact_name,
        emergency_contact_phone: profile.emergency_contact_phone,
      });
      goTo("/patient/dashboard");
    } catch (err) {
      // Token preserved — user can retry
      setApiError(err?.detail || "Profile update failed. You can retry or continue later from your dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const setA = (f) => (e) => { setAcct((a) => ({ ...a, [f]: e.target.value })); if (acctErrors[f]) setAcctErrors((x) => ({ ...x, [f]: "" })); };
  const setP = (f) => (e) => { setProfile((p) => ({ ...p, [f]: e.target.value })); if (profErrors[f]) setProfErrors((x) => ({ ...x, [f]: "" })); };

  const strength = passwordStrength(acct.password);
  

  return (
    <>
      <style>{css}</style>
      <div className="reg-root">
        <div className="reg-header">
          <div className="reg-logo">
            ✦ SYNC<span style={{ color: "var(--clay)" }}>HEALTH</span>
          </div>

          {/* Step indicator */}
          <div className="step-track">
            {[["01", "Account"], ["02", "Profile"]].map(([num, label], i) => {
              const idx = i + 1;
              const cls = step > idx ? "done" : step === idx ? "active" : "";
              return (
                <div key={idx} className={`step-item${step > idx ? " completed" : ""}${step === idx ? " active" : ""}`}>
                  <div className={`step-bubble ${cls}`}>
                    {step > idx ? "✓" : num}
                  </div>
                  <span className="step-label">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="reg-card">
          {step === 1 ? (
            <>
              <p className="card-eyebrow">Step 1 of 2</p>
              <h2 className="card-title">Create your account</h2>
              <p className="card-sub">Already have one? <a href="/login" onClick={(e) => { e.preventDefault(); goTo("/login"); }} style={{ color: "var(--moss)", textDecoration: "none", fontWeight: 500 }}>Sign in</a></p>

              {apiError && <div className="error-banner">⚠ {apiError}</div>}

              <form onSubmit={handleStep1} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="full_name">Full Name <span>*</span></label>
                    <input id="full_name" type="text" className={`form-input${acctErrors.full_name ? " err" : ""}`}
                      placeholder="Sara Ahmed" value={acct.full_name} onChange={setA("full_name")} />
                    {acctErrors.full_name && <span className="field-error">{acctErrors.full_name}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address <span>*</span></label>
                    <input id="email" type="email" className={`form-input${acctErrors.email ? " err" : ""}`}
                      placeholder="sara@example.com" value={acct.email} onChange={setA("email")} autoComplete="email" />
                    {acctErrors.email && <span className="field-error">{acctErrors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone Number</label>
                    <input id="phone" type="tel" className={`form-input${acctErrors.phone ? " err" : ""}`}
                      placeholder="+923009876543" value={acct.phone} onChange={setA("phone")} />
                    {acctErrors.phone && <span className="field-error">{acctErrors.phone}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">Password <span>*</span></label>
                    <div className="password-wrap">
                      <input id="password" type={showPass ? "text" : "password"}
                        className={`form-input${acctErrors.password ? " err" : ""}`}
                        placeholder="Min 8 characters" value={acct.password} onChange={setA("password")} />
                      <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)} tabIndex={-1}>
                        {showPass ? "🙈" : "👁"}
                      </button>
                    </div>
                    {acct.password && (
                      <div className="password-strength">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`strength-bar${i <= strength ? (strength <= 1 ? " weak" : strength <= 2 ? " medium" : " strong") : ""}`} />
                        ))}
                      </div>
                    )}
                    {acctErrors.password && <span className="field-error">{acctErrors.password}</span>}
                    {acct.password && !acctErrors.password && <span style={{ fontSize: "0.76rem", color: STRENGTH_COLOR[strength] }}>{STRENGTH_LABEL[strength]} password</span>}
                  </div>
                </div>

                <div className="btn-row">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <><span className="spinner" /> Creating account…</> : "Continue →"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <p className="card-eyebrow">Step 2 of 2</p>
              <h2 className="card-title">Complete your profile</h2>
              <p className="card-sub">This helps doctors provide you better care.</p>

              {apiError && <div className="error-banner">⚠ {apiError}</div>}

              <form onSubmit={handleStep2} noValidate>
                <div className="form-row cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="age">Age <span>*</span></label>
                    <input id="age" type="number" min="1" max="120" className={`form-input${profErrors.age ? " err" : ""}`}
                      placeholder="28" value={profile.age} onChange={setP("age")} />
                    {profErrors.age && <span className="field-error">{profErrors.age}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="gender">Gender <span>*</span></label>
                    <div className="select-wrap">
                      <select id="gender" className={`form-select${profErrors.gender ? " err" : ""}`}
                        value={profile.gender} onChange={setP("gender")}>
                        <option value="">Select…</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    {profErrors.gender && <span className="field-error">{profErrors.gender}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">City <span>*</span></label>
                    <div className="select-wrap">
                      <select id="city" className={`form-select${profErrors.city ? " err" : ""}`}
                        value={profile.city} onChange={setP("city")}>
                        <option value="">Select your city…</option>
                        {PAKISTANI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {profErrors.city && <span className="field-error">{profErrors.city}</span>}
                  </div>
                </div>

                <div style={{ borderTop: "1px dashed var(--border)", margin: "1.25rem 0", paddingTop: "1.25rem" }}>
                  <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--moss)", marginBottom: "1rem" }}>
                    Emergency Contact
                  </p>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="ec_name">Contact Name <span>*</span></label>
                      <input id="ec_name" type="text" className={`form-input${profErrors.emergency_contact_name ? " err" : ""}`}
                        placeholder="Ahmed Ali" value={profile.emergency_contact_name} onChange={setP("emergency_contact_name")} />
                      {profErrors.emergency_contact_name && <span className="field-error">{profErrors.emergency_contact_name}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="ec_phone">Contact Phone <span>*</span></label>
                      <input id="ec_phone" type="tel" className={`form-input${profErrors.emergency_contact_phone ? " err" : ""}`}
                        placeholder="+923331234567" value={profile.emergency_contact_phone} onChange={setP("emergency_contact_phone")} />
                      {profErrors.emergency_contact_phone && <span className="field-error">{profErrors.emergency_contact_phone}</span>}
                    </div>
                  </div>
                </div>

                <div className="btn-row">
                  <button type="button" className="btn-back" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <><span className="spinner" /> Saving…</> : "Finish Onboarding →"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
