// ─────────────────────────────────────────────────────────────────────────────
//  SyncHealth — App.jsx
//  React Router v6 routing with protected + public route guards.
//
//  Install dependencies:
//    npm install react-router-dom
// ─────────────────────────────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute, ROLE_HOME } from "./routes/RouteGuards";
import Login from "./components/auth/Login";
import PatientRegister from "./components/auth/PatientRegister";
import DoctorRegister from "./components/auth/DoctorRegister";

// ─────────────────────────────────────────────────────────────────────────────
//  Placeholder dashboards (replace with real pages)
// ─────────────────────────────────────────────────────────────────────────────

function DashboardShell({ title, color, role }) {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // Show "Profile under review" banner for doctors coming from registration
  const showReviewBanner =
    role === "doctor" &&
    sessionStorage.getItem("doctor_review_banner") === "1";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#FAF7F2",
      fontFamily: "'DM Sans', sans-serif", padding: "2rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=DM+Sans:wght@400;500&display=swap');
        .dash-nav { display:flex; align-items:center; justify-content:space-between; margin-bottom:2.5rem; }
        .dash-logo { font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:0.9rem; color:#4A7C59; }
        .dash-user { font-size:0.85rem; color:#6b6b6b; display:flex; align-items:center; gap:1rem; }
        .btn-logout { background:none; border:1.5px solid #e0dbd4; border-radius:8px; padding:0.4rem 0.85rem; font-size:0.82rem; cursor:pointer; color:#6b6b6b; font-family:inherit; transition:all 0.2s; }
        .btn-logout:hover { border-color:#1A1A1A; color:#1A1A1A; }
        .review-banner { background:#fffbea; border:1px solid #f5d98a; border-left:3px solid #d4a853; border-radius:8px; padding:0.75rem 1rem; font-size:0.85rem; color:#9a6c00; margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem; }
        .dash-card { background:#fff; border:1px solid #e0dbd4; border-radius:16px; padding:2rem; max-width:480px; }
        .dash-title { font-family:'IBM Plex Mono',monospace; font-size:1.4rem; font-weight:600; color:#1A1A1A; margin-bottom:0.4rem; }
        .dash-sub { font-size:0.9rem; color:#6b6b6b; }
        .role-chip { display:inline-block; background:${color}22; border:1px solid ${color}44; color:${color}; border-radius:6px; padding:0.25rem 0.65rem; font-family:'IBM Plex Mono',monospace; font-size:0.68rem; letter-spacing:0.1em; text-transform:uppercase; margin-top:1rem; }
      `}</style>

      <div className="dash-nav">
        <div className="dash-logo">✦ SYNC<span style={{ color: "#C7622A" }}>HEALTH</span></div>
        <div className="dash-user">
          <span>Hello, {currentUser?.full_name?.split(" ")[0] || "User"}</span>
          <button className="btn-logout" onClick={handleLogout}>Sign out</button>
        </div>
      </div>

      {showReviewBanner && (
        <div className="review-banner" onClick={() => sessionStorage.removeItem("doctor_review_banner")}>
          ⏳ <strong>Profile under review</strong> — Our team will verify your credentials within 24–48 hours.
        </div>
      )}

      <div className="dash-card">
        <div className="dash-title">{title}</div>
        <div className="dash-sub">Welcome back, {currentUser?.full_name}.</div>
        <div className="dash-sub" style={{ marginTop: "0.25rem", fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.75rem", color: "#aaa" }}>
          {currentUser?.email}
        </div>
        <div className="role-chip">{role} dashboard</div>
      </div>
    </div>
  );
}

// Role-specific dashboard wrappers
function PatientDashboard() {
  return <DashboardShell title="Patient Dashboard" color="#4A7C59" role="patient" />;
}
function DoctorDashboard() {
  return <DashboardShell title="Doctor Dashboard" color="#C7622A" role="doctor" />;
}
function AdminDashboard() {
  return <DashboardShell title="Admin Panel" color="#2c3e50" role="admin" />;
}

// ─────────────────────────────────────────────────────────────────────────────
//  404 Not Found
// ─────────────────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#FAF7F2", fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@600&family=DM+Sans:wght@400;500&display=swap');`}</style>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "4rem", fontWeight: 600, color: "#e0dbd4" }}>404</div>
      <p style={{ color: "#6b6b6b", marginBottom: "1.5rem" }}>Page not found.</p>
      <Link to="/login" style={{ color: "#4A7C59", fontWeight: 500, textDecoration: "none" }}>← Back to login</Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Router — wrapper that passes navigate to auth pages
// ─────────────────────────────────────────────────────────────────────────────
function LoginPage() {
  const navigate = useNavigate();
  return <Login navigate={navigate} />;
}
function PatientRegisterPage() {
  const navigate = useNavigate();
  return <PatientRegister navigate={navigate} />;
}
function DoctorRegisterPage() {
  const navigate = useNavigate();
  return <DoctorRegister navigate={navigate} />;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Root redirect — sends "/" to the right place based on login status
// ─────────────────────────────────────────────────────────────────────────────
function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[role] || "/login"} replace />;
}

// ─────────────────────────────────────────────────────────────────────────────
//  App — full route tree
// ─────────────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Root → smart redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* ── Public routes (redirect logged-in users away) ── */}
      <Route path="/login" element={
        <PublicRoute><LoginPage /></PublicRoute>
      } />
      <Route path="/register/patient" element={
        <PublicRoute><PatientRegisterPage /></PublicRoute>
      } />
      <Route path="/register/doctor" element={
        <PublicRoute><DoctorRegisterPage /></PublicRoute>
      } />

      {/* ── Protected: Patient only ── */}
      <Route path="/patient/dashboard" element={
        <ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>
      } />

      {/* ── Protected: Doctor only ── */}
      <Route path="/doctor/dashboard" element={
        <ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>
      } />

      {/* ── Protected: Admin only ── */}
      <Route path="/admin" element={
        <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
      } />

      {/* ── 404 ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
