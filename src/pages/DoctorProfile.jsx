import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { doctorService } from "../services/doctorService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const PLACEHOLDER = {
  id: "1",
  full_name: "Dr. Ayesha Malik",
  specialty: "Cardiologist",
  sub_specialty: "Interventional Cardiology",
  city: "Lahore",
  clinic_name: "Shaukat Khanum Memorial Hospital",
  clinic_address: "7A, Johar Town, Lahore",
  years_of_experience: 12,
  online_fee: 2000,
  physical_fee: 3500,
  rating: 4.8,
  reviews: 124,
  about:
    "Dr. Ayesha Malik is a board-certified cardiologist with over 12 years of experience in diagnosing and treating heart conditions. She specializes in interventional procedures and preventive cardiology, serving patients across Lahore and beyond.",
  pmc_number: "PMC-45231",
};

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const heroRef = useRef(null);

  useEffect(() => {
    doctorService
      .getProfile(id)
      .then(setDoctor)
      .catch(() => setDoctor(PLACEHOLDER))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!loading && heroRef.current) {
      heroRef.current.style.opacity = "0";
      heroRef.current.style.transform = "translateY(24px)";
      setTimeout(() => {
        if (heroRef.current) {
          heroRef.current.style.transition = "all 0.7s cubic-bezier(0.25,0.46,0.45,0.94)";
          heroRef.current.style.opacity = "1";
          heroRef.current.style.transform = "translateY(0)";
        }
      }, 60);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F2F0E9" }}>
        <div className="w-8 h-8 border-2 border-moss border-t-transparent rounded-full animate-spin" style={{ borderColor: "#2E4036", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const d = doctor || PLACEHOLDER;
  const initials = d.full_name.split(" ").filter((w) => !w.startsWith("Dr.")).slice(0, 2).map((w) => w[0]).join("");

  return (
    <div className="min-h-screen hex-bg">
      <Navbar />

      <div className="pt-28 pb-16 px-8 md:px-16" ref={heroRef}>
        <div>
          {/* Back link */}
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
            style={{ color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All doctors
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: info */}
            <div className="lg:col-span-2 space-y-5">
              {/* Hero card */}
              <div
                className="rounded-2xl p-6 border"
                style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl font-bold"
                    style={{ background: "rgba(46,64,54,0.08)", color: "#2E4036", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1">
                    <h1
                      className="text-2xl font-bold mb-1"
                      style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.01em" }}
                    >
                      {d.full_name}
                    </h1>
                    <p className="text-base font-medium mb-0.5" style={{ color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}>
                      {d.specialty}
                      {d.sub_specialty && <span className="font-normal opacity-70"> &middot; {d.sub_specialty}</span>}
                    </p>
                    <p className="text-sm" style={{ color: "#1A1A1A", opacity: 0.45, fontFamily: "'Outfit', sans-serif" }}>
                      {d.clinic_name && `${d.clinic_name}, `}{d.city} &middot; {d.years_of_experience} yrs experience
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 12 12" fill={s <= Math.round(d.rating || 4.7) ? "#CC5833" : "rgba(204,88,51,0.2)"}>
                            <path d="M6 0l1.5 4H12L8.5 6.5 10 12 6 9l-4 3 1.5-5.5L0 4h4.5z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium" style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>
                        {(d.rating || 4.7).toFixed(1)}
                      </span>
                      <span className="text-xs" style={{ color: "#1A1A1A", opacity: 0.35, fontFamily: "'Outfit', sans-serif" }}>
                        ({d.reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(46,64,54,0.06)", color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>
                    PMC: {d.pmc_number}
                  </span>
                  {d.clinic_address && (
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(46,64,54,0.06)", color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}>
                      {d.clinic_address}
                    </span>
                  )}
                </div>
              </div>

              {/* About */}
              {d.about && (
                <div
                  className="rounded-2xl p-6 border"
                  style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
                >
                  <h2 className="text-sm uppercase tracking-widest mb-3" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
                    About
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "#1A1A1A", opacity: 0.7, fontFamily: "'Outfit', sans-serif" }}>
                    {d.about}
                  </p>
                </div>
              )}
            </div>

            {/* Right: booking */}
            <div className="space-y-4">
              <div
                className="rounded-2xl p-6 border sticky top-24"
                style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
              >
                <h2 className="text-sm uppercase tracking-widest mb-4" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
                  Consultation fees
                </h2>

                <div className="space-y-3 mb-6">
                  {[
                    { label: "Online", fee: d.online_fee },
                    { label: "In-clinic", fee: d.physical_fee },
                    ...(d.home_visit_fee ? [{ label: "Home visit", fee: d.home_visit_fee }] : []),
                  ].map(({ label, fee }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: "#1A1A1A", opacity: 0.55, fontFamily: "'Outfit', sans-serif" }}>
                        {label}
                      </span>
                      <span className="text-sm font-bold" style={{ color: "#2E4036", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        PKR {(fee || 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {user ? (
                  <button
                    className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                    style={{ background: "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif" }}
                  >
                    Book Appointment
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/register/patient"
                      className="block w-full py-3 rounded-xl text-center text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                      style={{ background: "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif" }}
                    >
                      Register to Book
                    </Link>
                    <Link
                      to="/login"
                      className="block w-full py-2.5 rounded-xl text-center text-sm font-medium transition-all duration-200"
                      style={{ background: "rgba(46,64,54,0.06)", color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}
                    >
                      Already have an account?
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
