import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? "#2E4036" : "#1A1A1A",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: isActive(path) ? 600 : 400,
  });

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full px-6 py-3 flex items-center gap-6 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/60"
          : "bg-white/25 backdrop-blur-md border border-white/30"
      }`}
      style={{ minWidth: "min(860px, 95vw)" }}
    >
      {/* Logo */}
      <Link to="https://landing-page-sync.vercel.app"
        className="font-bold text-xl tracking-tight flex-shrink-0"
        style={{ color: "#2E4036", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Sync
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-5 flex-1">
        <Link to="https://landing-page-sync.vercel.app"
          className="text-sm transition-all duration-200 hover:-translate-y-px"
          style={{ color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" }}>
          Home
        </Link>
        <Link to="/doctors"
          className="text-sm transition-all duration-200 hover:-translate-y-px"
          style={linkStyle("/doctors")}>
          Find Doctors
        </Link>
        <Link to="https://landing-page-sync.vercel.app/for-doctors"
          className="text-sm transition-all duration-200 hover:-translate-y-px"
          style={{ color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" }}>
          For Doctors
        </Link>
      </div>

      {/* Auth */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {user ? (
          <>
            <Link to={user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"}
              className="text-sm font-medium transition-all duration-200 hover:-translate-y-px"
              style={{ color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}>
              Dashboard
            </Link>
            <button onClick={handleLogout}
              className="text-sm px-5 py-2 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{ background: "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif" }}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login"
              className="text-sm transition-all duration-200 hover:-translate-y-px"
              style={{ color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" }}>
              Login
            </Link>
            <Link to="/register/patient"
              className="text-sm px-5 py-2 rounded-full font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{ background: "#CC5833", color: "#fff", fontFamily: "'Outfit', sans-serif" }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
