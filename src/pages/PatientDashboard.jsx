import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UPCOMING = [
  { id: "a1", doctor: "Dr. Ayesha Malik", specialty: "Cardiologist", date: "18 March 2026", time: "10:30 AM", type: "Online" },
  { id: "a2", doctor: "Dr. Tariq Ahmed", specialty: "Neurologist", date: "25 March 2026", time: "3:00 PM", type: "In-clinic" },
];

const AI_SUGGESTIONS = [
  { specialty: "Cardiologist", reason: "Based on your reported chest discomfort" },
  { specialty: "General Physician", reason: "For routine checkup" },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! Tell me what symptoms you're experiencing and I'll help you find the right specialist." },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const headerRef = useRef(null);
  const chatEndRef = useRef(null);

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);
    try {
      const token = localStorage.getItem("sync_auth");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply || data.message || "I can help you find the right specialist. Could you describe your symptoms in more detail?" }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Based on your symptoms, I would suggest seeing a General Physician first. Would you like me to find available doctors in your city?" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const firstName = user?.full_name?.split(" ").find((w) => !w.startsWith("Dr.")) || "there";

  return (
    <div className="min-h-screen hex-bg">
      <Navbar />

      <div className="pt-28 pb-16 px-8 md:px-16" ref={headerRef}>
        <div>
          {/* Greeting */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
              Patient dashboard
            </p>
            <h1 className="text-3xl font-bold" style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}>
              Good morning,{" "}
              <em style={{ color: "#2E4036", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                {firstName}
              </em>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Health Assistant */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
              >
                <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "rgba(46,64,54,0.08)" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#2E4036" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="3" fill="#F2F0E9" />
                      <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="#F2F0E9" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Sync Health AI
                    </p>
                    <p className="text-xs" style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'Outfit', sans-serif" }}>
                      Describe your symptoms
                    </p>
                  </div>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: "rgba(46,64,54,0.06)", color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>
                    AI
                  </span>
                </div>

                {/* Chat messages */}
                <div className="px-6 py-4 max-h-72 overflow-y-auto space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className="max-w-xs px-4 py-2.5 rounded-2xl text-sm"
                        style={{
                          background: msg.role === "user" ? "#2E4036" : "rgba(46,64,54,0.06)",
                          color: msg.role === "user" ? "#F2F0E9" : "#1A1A1A",
                          fontFamily: "'Outfit', sans-serif",
                          lineHeight: "1.5",
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(46,64,54,0.06)" }}>
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#2E4036", animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="px-4 pb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Describe your symptoms..."
                      className="flex-1 px-4 py-2.5 rounded-xl border outline-none text-sm"
                      style={{
                        borderColor: "rgba(46,64,54,0.15)",
                        background: "#F2F0E9",
                        fontFamily: "'Outfit', sans-serif",
                        color: "#1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#2E4036")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={chatLoading || !chatInput.trim()}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                      style={{ background: "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif", opacity: chatInput.trim() ? 1 : 0.5 }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Upcoming appointments */}
              <div>
                <h2 className="text-sm uppercase tracking-widest mb-4" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
                  Upcoming appointments
                </h2>
                {UPCOMING.length === 0 ? (
                  <div
                    className="rounded-2xl p-8 text-center border"
                    style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
                  >
                    <p className="text-sm" style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'Outfit', sans-serif" }}>
                      No upcoming appointments.{" "}
                      <Link to="/doctors" className="underline" style={{ color: "#2E4036" }}>
                        Find a doctor
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {UPCOMING.map((appt) => (
                      <div
                        key={appt.id}
                        className="rounded-2xl p-5 border flex items-center justify-between"
                        style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
                      >
                        <div>
                          <p className="font-semibold text-sm mb-0.5" style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {appt.doctor}
                          </p>
                          <p className="text-xs" style={{ color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}>
                            {appt.specialty}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "#1A1A1A", opacity: 0.45, fontFamily: "'Outfit', sans-serif" }}>
                            {appt.date} at {appt.time}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
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
                          <button className="text-xs underline underline-offset-2 transition-opacity hover:opacity-60" style={{ color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Quick links */}
              <div
                className="rounded-2xl p-5 border"
                style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
              >
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
                  Quick actions
                </p>
                <div className="space-y-2">
                  <Link
                    to="/doctors"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:-translate-y-px"
                    style={{ background: "#2E4036", color: "#F2F0E9" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="#F2F0E9" strokeWidth="1.5" />
                      <path d="M8 5v3l2 1" stroke="#F2F0E9" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="text-sm font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>Find a Doctor</span>
                  </Link>
                  <Link
                    to="/patient/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:-translate-y-px"
                    style={{ background: "rgba(46,64,54,0.06)", color: "#2E4036" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="6" r="3" stroke="#2E4036" strokeWidth="1.5" />
                      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#2E4036" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="text-sm font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>Edit Profile</span>
                  </Link>
                </div>
              </div>

              {/* AI Suggestions */}
              <div
                className="rounded-2xl p-5 border"
                style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
              >
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#CC5833", opacity: 0.7, fontFamily: "'IBM Plex Mono', monospace" }}>
                  Recommended
                </p>
                <div className="space-y-3">
                  {AI_SUGGESTIONS.map((s) => (
                    <div key={s.specialty}>
                      <p className="text-sm font-semibold" style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {s.specialty}
                      </p>
                      <p className="text-xs" style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'Outfit', sans-serif" }}>
                        {s.reason}
                      </p>
                      <Link
                        to={`/doctors?specialty=${s.specialty}`}
                        className="text-xs underline underline-offset-2 mt-1 inline-block transition-opacity hover:opacity-60"
                        style={{ color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}
                      >
                        Find {s.specialty}
                      </Link>
                    </div>
                  ))}
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
