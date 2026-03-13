import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/services";
import { validateLogin, ROLE_HOME } from "../utils/validators";

// ─── Inline styles (no Tailwind dependency for portability) ───────────────────
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

  .login-root {
    min-height: 100vh;
    background: var(--cream);
    display: flex;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Left decorative panel */
  .login-panel-left {
    display: none;
    width: 44%;
    background: var(--moss);
    position: relative;
    overflow: hidden;
    flex-direction: column;
    justify-content: flex-end;
    padding: 3rem;
  }
  @media (min-width: 900px) { .login-panel-left { display: flex; } }

  .panel-noise {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  .panel-circles {
    position: absolute;
    top: -80px;
    right: -80px;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    border: 60px solid rgba(255,255,255,0.06);
  }
  .panel-circles::after {
    content: '';
    position: absolute;
    inset: -80px;
    border-radius: 50%;
    border: 40px solid rgba(255,255,255,0.04);
  }

  .panel-tag {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--moss-light);
    opacity: 0.8;
    margin-bottom: 1rem;
  }

  .panel-headline {
    font-family: 'Lora', serif;
    font-size: 2.4rem;
    font-weight: 500;
    color: #fff;
    line-height: 1.25;
    margin-bottom: 1.5rem;
  }

  .panel-sub {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.65);
    line-height: 1.6;
  }

  .panel-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 6px;
    padding: 0.5rem 0.85rem;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    color: rgba(255,255,255,0.85);
    margin-top: 2rem;
  }
  .badge-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #7dffb3;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* Right form panel */
  .login-panel-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    opacity: 0;
    transform: translateY(24px);
    animation: slideUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
  }
  @keyframes slideUp {
    to { opacity: 1; transform: translateY(0); }
  }

  .login-logo {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 1rem;
    font-weight: 600;
    color: var(--moss);
    letter-spacing: 0.05em;
    margin-bottom: 2.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .logo-icon {
    width: 28px; height: 28px;
    background: var(--moss);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .logo-icon svg { color: #fff; width: 14px; height: 14px; }

  .login-heading {
    font-family: 'Lora', serif;
    font-size: 2rem;
    font-weight: 500;
    color: var(--dark);
    margin-bottom: 0.5rem;
  }

  .login-subheading {
    font-size: 0.9rem;
    color: var(--mid);
    margin-bottom: 2rem;
  }

  /* Error banner */
  .error-banner {
    background: var(--error-bg);
    border: 1px solid #f5c6c0;
    border-left: 3px solid var(--error);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: var(--error);
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

  /* Form */
  .form-group {
    margin-bottom: 1.1rem;
    opacity: 0;
    animation: slideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .form-group:nth-child(1) { animation-delay: 0.2s; }
  .form-group:nth-child(2) { animation-delay: 0.28s; }
  .form-group:nth-child(3) { animation-delay: 0.36s; }

  .form-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--dark);
    margin-bottom: 0.4rem;
    letter-spacing: 0.02em;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--dark);
    background: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }
  .form-input:focus {
    border-color: var(--moss);
    box-shadow: 0 0 0 3px rgba(74,124,89,0.12);
  }
  .form-input.error {
    border-color: var(--error);
    box-shadow: 0 0 0 3px rgba(192,57,43,0.1);
  }
  .field-error {
    font-size: 0.78rem;
    color: var(--error);
    margin-top: 0.3rem;
  }

  .password-wrapper {
    position: relative;
  }
  .password-toggle {
    position: absolute;
    right: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--mid);
    padding: 0.2rem;
    display: flex;
    align-items: center;
  }
  .password-toggle:hover { color: var(--dark); }

  /* Submit button */
  .btn-primary {
    width: 100%;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    position: relative;
    overflow: hidden;
  }
  .btn-primary:hover:not(:disabled) {
    background: var(--moss-dark);
    box-shadow: 0 4px 16px rgba(74,124,89,0.28);
    transform: translateY(-1px);
  }
  .btn-primary:active:not(:disabled) { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
    color: var(--mid);
    font-size: 0.8rem;
  }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .register-links {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .btn-outline {
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    color: var(--moss);
    border: 1.5px solid var(--moss);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    text-decoration: none;
    display: block;
  }
  .btn-outline:hover {
    background: var(--moss-light);
    border-color: var(--moss-dark);
  }

  .btn-outline-clay {
    color: var(--clay);
    border-color: var(--clay);
  }
  .btn-outline-clay:hover {
    background: var(--clay-light);
    border-color: #a85020;
  }

  .footer-note {
    text-align: center;
    font-size: 0.78rem;
    color: var(--mid);
    margin-top: 1.75rem;
    font-family: 'IBM Plex Mono', monospace;
  }
`;

export default function Login({ navigate }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // navigate prop fallback
  const goTo = (path) => {
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setApiError("");
    const errs = validateLogin(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const data = await authService.login({ email: form.email.trim(), password: form.password });
      login(data);
      const role = data.user?.role;
      goTo(ROLE_HOME[role] || "/patient/dashboard");
    } catch (err) {
      if (err?.detail?.toLowerCase().includes("invalid") || err?.status === 401) {
        setApiError("Invalid email or password. Please try again.");
      } else if (err?.status >= 500 || !navigator.onLine) {
        setApiError("Service temporarily unavailable. Please try again later.");
      } else {
        setApiError(err?.detail || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: "" }));
  };

  return (
    <>
      <style>{css}</style>
      <div className="login-root">
        {/* Left decorative panel */}
        <div className="login-panel-left">
          <div className="panel-noise" />
          <div className="panel-circles" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p className="panel-tag">● SyncHealth Platform</p>
            <h2 className="panel-headline">
              Your health,<br />connected.
            </h2>
            <p className="panel-sub">
              Pakistan's trusted telemedicine platform — connecting patients with verified doctors, anytime.
            </p>
            <span className="panel-badge">
              <span className="badge-dot" />
              Secure · HIPAA-aligned · PKR billing
            </span>
          </div>
        </div>

        {/* Right form */}
        <div className="login-panel-right">
          <div className="login-card">
            <div className="login-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              SYNC<span style={{ color: "var(--clay)" }}>HEALTH</span>
            </div>

            <h1 className="login-heading">Welcome back</h1>
            <p className="login-subheading">Sign in to your account to continue</p>

            {apiError && (
              <div className="error-banner">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  className={`form-input${errors.email ? " error" : ""}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set("email")}
                  onKeyDown={handleKeyDown}
                  autoComplete="email"
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    className={`form-input${errors.password ? " error" : ""}`}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                    onKeyDown={handleKeyDown}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPass((s) => !s)}
                    tabIndex={-1}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="field-error">{errors.password}</p>}
              </div>

              <div className="form-group">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? <><span className="spinner" /> Signing in…</> : "Sign in →"}
                </button>
              </div>
            </form>

            <div className="divider">or register as</div>

            <div className="register-links">
              <a className="btn-outline" href="/register/patient" onClick={(e) => { e.preventDefault(); goTo("/register/patient"); }}>
                Register as Patient
              </a>
              <a className="btn-outline btn-outline-clay" href="/register/doctor" onClick={(e) => { e.preventDefault(); goTo("/register/doctor"); }}>
                Register as Doctor
              </a>
            </div>

            <p className="footer-note">
              © 2025 SyncHealth · Pakistan
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
