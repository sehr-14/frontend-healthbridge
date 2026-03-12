import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doctorService } from "../services/doctorService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TODAY_APPOINTMENTS = [
  { id: "t1", patient: "Muhammad Usman", age: 34, time: "9:00 AM", type: "Online", status: "confirmed" },
  { id: "t2", patient: "Fatima Zahra", age: 28, time: "11:30 AM", type: "In-clinic", status: "confirmed" },
  { id: "t3", patient: "Ahmed Raza", age: 52, time: "2:00 PM", type: "Online", status: "pending" },
];

const UPCOMING = [
  { id: "u1", patient: "Sara Bano", age: 41, date: "19 March", time: "10:00 AM", type: "In-clinic", status: "confirmed" },
  { id: "u2", patient: "Tariq Mehmood", age: 29, date: "21 March", time: "3:30 PM", type: "Online", status: "confirmed" },
];

const STATS = [
  { label: "Total Patients", value: "142", sub: "this month" },
  { label: "This Week", value: "18", sub: "appointments" },
  { label: "Rating", value: "4.8", sub: "out of 5" },
  { label: "Response Rate", value: "96%", sub: "avg. 2hr reply" },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.opacity = "0";
      headerRef.current.style.transform = "translateY(20px)";
      setTimeout(() => {
        if (headerRef.current) {
          headerRef.current.style.transition = "all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)";
          headerRef.current.style.opacity = "1";
          headerRef.current.style.transform = "translateY(0)";
        }
      }, 60);
    }
  }, []);

  const firstName = user?.full_name?.replace("Dr. ", "").split(" ")[0] || "Doctor";

  return (
    <div className="min-h-screen hex-bg">
      <Navbar />

      <div className="pt-28 pb-16 px-8 md:px-16" ref={headerRef}>
        <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#CC5833", opacity: 0.7, fontFamily: "'IBM Plex Mono', monospace" }}>
                Doctor dashboard
              </p>
              <h1 className="text-3xl font-bold" style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}>
                Welcome back,{" "}
                <em style={{ color: "#CC5833", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                  Dr. {firstName}
                </em>
              </h1>
            </div>
            <div className="flex gap-3">
              <Link
                to="/doctor/profile/edit"
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                style={{ background: "rgba(204,88,51,0.08)", color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-5 border"
                style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
              >
                <p className="text-3xl font-bold mb-1" style={{ color: "#2E4036", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}>
                  {stat.value}
                </p>
                <p className="text-sm font-medium" style={{ color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" }}>
                  {stat.label}
                </p>
                <p className="text-xs" style={{ color: "#1A1A1A", opacity: 0.35, fontFamily: "'Outfit', sans-serif" }}>
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's appointments */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
                  Today's schedule
                </h2>
                <div className="space-y-3">
                  {TODAY_APPOINTMENTS.map((appt) => (
                    <div
                      key={appt.id}
                      className="rounded-2xl p-5 border flex items-center justify-between"
                      style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: "rgba(46,64,54,0.06)", color: "#2E4036", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {appt.patient.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {appt.patient}
                          </p>
                          <p className="text-xs" style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'Outfit', sans-serif" }}>
                            Age {appt.age} &middot; {appt.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs px-2.5 py-1 rounded-full"
                          style={{
                            background: appt.type === "Online" ? "rgba(46,64,54,0.08)" : "rgba(204,88,51,0.08)",
                            color: appt.type === "Online" ? "#2E4036" : "#CC5833",
                            fontFamily: "'IBM Plex Mono', monospace",
                          }}
                        >
                          {appt.type}
                        </span>
                        <Link
                          to={`/doctor/appointments/${appt.id}/notes`}
                          className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                          style={{ background: "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif" }}
                        >
                          Notes
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming */}
              <div>
                <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
                  Upcoming
                </h2>
                <div className="space-y-3">
                  {UPCOMING.map((appt) => (
                    <div
                      key={appt.id}
                      className="rounded-2xl p-5 border flex items-center justify-between"
                      style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
                    >
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {appt.patient}
                        </p>
                        <p className="text-xs" style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'Outfit', sans-serif" }}>
                          {appt.date} at {appt.time}
                        </p>
                      </div>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          background: appt.type === "Online" ? "rgba(46,64,54,0.08)" : "rgba(204,88,51,0.08)",
                          color: appt.type === "Online" ? "#2E4036" : "#CC5833",
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}
                      >
                        {appt.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Status */}
              <div className="rounded-2xl p-5 border" style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
                  Profile status
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-sm font-medium" style={{ color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" }}>
                    Verification pending
                  </span>
                </div>
                <p className="text-xs" style={{ color: "#1A1A1A", opacity: 0.45, fontFamily: "'Outfit', sans-serif" }}>
                  Your PMC license is being verified. This usually takes 1-2 business days.
                </p>
              </div>

              {/* Quick links */}
              <div className="rounded-2xl p-5 border" style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}>
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
                  Quick actions
                </p>
                <div className="space-y-2">
                  <Link
                    to="/doctor/profile/edit"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-px"
                    style={{ background: "#CC5833", color: "#fff", fontFamily: "'Outfit', sans-serif" }}
                  >
                    Edit practice details
                  </Link>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-px text-left"
                    style={{ background: "rgba(46,64,54,0.06)", color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}
                  >
                    Set availability
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
