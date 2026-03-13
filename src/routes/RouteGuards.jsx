// ─────────────────────────────────────────────────────────────────────────────
//  SyncHealth — Route Guards
//
//  ProtectedRoute  — requires auth + optional role check
//  PublicRoute     — redirects already-logged-in users away from auth pages
// ─────────────────────────────────────────────────────────────────────────────

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Role → default dashboard map ─────────────────────────────────────────────
export const ROLE_HOME = {
  patient: "/patient/dashboard",
  doctor:  "/doctor/dashboard",
  admin:   "/admin",
};

// ── Loading spinner (shown while auth state initialises) ──────────────────────
function AuthSpinner() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#FAF7F2",
    }}>
      <div style={{
        width: 36, height: 36,
        border: "3px solid #d4e8db",
        borderTopColor: "#4A7C59",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ProtectedRoute
//  Usage:
//    <ProtectedRoute>                   → any authenticated user
//    <ProtectedRoute role="doctor">     → only doctors
//    <ProtectedRoute role={["doctor","admin"]}> → multiple roles
// ─────────────────────────────────────────────────────────────────────────────
export function ProtectedRoute({ children, role }) {
  const { isAuthenticated, role: userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthSpinner />;

  // Not logged in → send to login, remember where they wanted to go
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check
  if (role) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(userRole)) {
      // Logged in but wrong role → redirect to their own dashboard
      const home = ROLE_HOME[userRole] || "/login";
      return <Navigate to={home} replace />;
    }
  }

  return children;
}

// ─────────────────────────────────────────────────────────────────────────────
//  PublicRoute
//  Redirects authenticated users away from /login, /register/*, etc.
//  Usage:  <PublicRoute><Login /></PublicRoute>
// ─────────────────────────────────────────────────────────────────────────────
export function PublicRoute({ children }) {
  const { isAuthenticated, role: userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthSpinner />;

  if (isAuthenticated) {
    // If they came from a protected page, send them back there
    const intended = location.state?.from?.pathname;
    const home = ROLE_HOME[userRole] || "/";
    return <Navigate to={intended || home} replace />;
  }

  return children;
}
