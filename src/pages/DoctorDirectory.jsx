import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doctorService } from "../services/doctorService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SPECIALTIES = [
  "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
  "Orthopedic Surgeon", "Gynecologist", "Pediatrician", "Psychiatrist",
  "Ophthalmologist", "ENT Specialist", "Urologist", "Oncologist",
  "Gastroenterologist", "Pulmonologist", "Endocrinologist", "Dentist",
];

const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad",
];

const PLACEHOLDER_DOCTORS = [
  { id: "1", full_name: "Dr. Ayesha Malik", specialty: "Cardiologist", city: "Lahore", years_of_experience: 12, online_fee: 2000, rating: 4.8, reviews: 124 },
  { id: "2", full_name: "Dr. Tariq Ahmed", specialty: "Neurologist", city: "Karachi", years_of_experience: 8, online_fee: 2500, rating: 4.7, reviews: 89 },
  { id: "3", full_name: "Dr. Sara Iqbal", specialty: "Dermatologist", city: "Islamabad", years_of_experience: 6, online_fee: 1500, rating: 4.9, reviews: 203 },
  { id: "4", full_name: "Dr. Bilal Chaudhry", specialty: "General Physician", city: "Lahore", years_of_experience: 15, online_fee: 1000, rating: 4.6, reviews: 312 },
  { id: "5", full_name: "Dr. Nadia Hussain", specialty: "Gynecologist", city: "Karachi", years_of_experience: 10, online_fee: 2200, rating: 4.8, reviews: 156 },
  { id: "6", full_name: "Dr. Kamran Shah", specialty: "Pediatrician", city: "Rawalpindi", years_of_experience: 9, online_fee: 1800, rating: 4.5, reviews: 78 },
  { id: "7", full_name: "Dr. Hina Qureshi", specialty: "Dermatologist", city: "Lahore", years_of_experience: 7, online_fee: 1700, rating: 4.8, reviews: 141 },
  { id: "8", full_name: "Dr. Usman Farooq", specialty: "Orthopedic Surgeon", city: "Islamabad", years_of_experience: 14, online_fee: 3000, rating: 4.6, reviews: 98 },
  { id: "9", full_name: "Dr. Zainab Raza", specialty: "Psychiatrist", city: "Karachi", years_of_experience: 5, online_fee: 2000, rating: 4.7, reviews: 67 },
  { id: "10", full_name: "Dr. Fahad Mirza", specialty: "ENT Specialist", city: "Lahore", years_of_experience: 11, online_fee: 1600, rating: 4.5, reviews: 53 },
  { id: "11", full_name: "Dr. Sana Yousuf", specialty: "Gynecologist", city: "Islamabad", years_of_experience: 8, online_fee: 2100, rating: 4.9, reviews: 189 },
  { id: "12", full_name: "Dr. Hamid Awan", specialty: "General Physician", city: "Karachi", years_of_experience: 20, online_fee: 800, rating: 4.4, reviews: 421 },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-3 h-3" viewBox="0 0 12 12"
          fill={s <= Math.round(rating || 4.7) ? "#CC5833" : "rgba(204,88,51,0.15)"}>
          <path d="M6 0l1.5 4H12L8.5 6.5 10 12 6 9l-4 3 1.5-5.5L0 4h4.5z" />
        </svg>
      ))}
    </div>
  );
}

function DoctorCard({ doctor, delay = 0 }) {
  const initials = doctor.full_name
    .split(" ")
    .filter((w) => !w.startsWith("Dr."))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div
      className="rounded-2xl p-6 border flex flex-col transition-all duration-300 hover:-translate-y-1 fade-up"
      style={{
        background: "#fff",
        borderColor: "rgba(46,64,54,0.09)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        animationDelay: `${delay}s`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 40px rgba(46,64,54,0.13)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)")}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg font-bold"
          style={{ background: "rgba(46,64,54,0.07)", color: "#2E4036", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base mb-0.5 truncate"
            style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {doctor.full_name}
          </h3>
          <p className="text-sm font-medium" style={{ color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}>
            {doctor.specialty}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#1A1A1A", opacity: 0.45, fontFamily: "'Outfit', sans-serif" }}>
            {doctor.city} · {doctor.years_of_experience} yrs exp.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium" style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>
            {(doctor.rating || 4.7).toFixed(1)}
          </span>
          <StarRating rating={doctor.rating} />
          <span className="text-xs" style={{ color: "#1A1A1A", opacity: 0.35, fontFamily: "'Outfit', sans-serif" }}>
            ({doctor.reviews || 0})
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'IBM Plex Mono', monospace" }}>Online</p>
          <p className="text-sm font-bold" style={{ color: "#2E4036", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            PKR {(doctor.online_fee || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <Link
        to={`/doctors/${doctor.id}`}
        className="block w-full py-3 rounded-xl text-center text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
        style={{ background: "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif" }}
      >
        View Profile
      </Link>
    </div>
  );
}

const HOME_URL = "https://landing-page-sync.vercel.app";

const dropdownStyle = {
  borderColor: "rgba(46,64,54,0.15)",
  background: "#F2F0E9",
  color: "#1A1A1A",
  fontFamily: "'Outfit', sans-serif",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232E4036' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: "40px",
  cursor: "pointer",
};

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState(PLACEHOLDER_DOCTORS);
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    doctorService.listDoctors().then(setDoctors).catch(() => {});
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSpecialty = !specialty || d.specialty === specialty;
    const matchCity = !city || d.city === city;
    const matchSearch = !search ||
      d.full_name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty?.toLowerCase().includes(search.toLowerCase());
    return matchSpecialty && matchCity && matchSearch;
  });

  const hasFilters = specialty || city || search;

  return (
    <div className="min-h-screen hex-bg">
      <Navbar />

      {/* Hero — full width, no max-width */}
      <div className="pt-36 pb-14 page-wide">
        <div className="fade-up">
          <p className="text-xs uppercase tracking-widest mb-4 text-center"
            style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
            AI-Powered Healthcare · Pakistan
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-5"
            style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            Find the right{" "}
            <em style={{ color: "#2E4036", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
              specialist
            </em>
          </h1>
          <p className="text-center text-lg max-w-2xl mx-auto mb-2"
            style={{ color: "#1A1A1A", opacity: 0.5, fontFamily: "'Outfit', sans-serif" }}>
            Browse verified doctors and book online or in-clinic consultations, anywhere in Pakistan.
          </p>
        </div>
      </div>

      {/* Filter bar — full width */}
      <div className="page-wide mb-10 fade-up-2">
        <div className="rounded-2xl p-4 flex flex-col md:flex-row gap-3"
          style={{ background: "#fff", border: "1px solid rgba(46,64,54,0.09)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border outline-none text-sm transition-all duration-200"
            style={{ borderColor: "rgba(46,64,54,0.15)", background: "#F2F0E9", color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" }}
            onFocus={(e) => (e.target.style.borderColor = "#2E4036")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")}
          />

          {/* Specialty select */}
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="px-4 py-3 rounded-xl border outline-none text-sm"
            style={{ ...dropdownStyle, minWidth: 210 }}
          >
            <option value="">Select Specialty</option>
            {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* City select */}
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-3 rounded-xl border outline-none text-sm"
            style={{ ...dropdownStyle, minWidth: 180 }}
          >
            <option value="">Select City</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={() => { setSpecialty(""); setCity(""); setSearch(""); }}
              className="px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] whitespace-nowrap"
              style={{ background: "rgba(204,88,51,0.08)", color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results — full width */}
      <div className="page-wide pb-20">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs" style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'IBM Plex Mono', monospace" }}>
            {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
            {specialty && ` · ${specialty}`}
            {city && ` · ${city}`}
          </p>
          {/* Back to Home */}
          <a href={HOME_URL}
            className="inline-flex items-center gap-1.5 text-sm transition-all duration-200 hover:opacity-60 hover:-translate-x-1"
            style={{ color: "#2E4036", fontFamily: "'Outfit', sans-serif" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </a>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-2xl font-bold mb-3" style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              No doctors found
            </p>
            <p className="text-sm mb-6" style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'Outfit', sans-serif" }}>
              Try different filters or search terms
            </p>
            <button
              onClick={() => { setSpecialty(""); setCity(""); setSearch(""); }}
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif" }}>
              Show all doctors
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((doc, i) => (
              <DoctorCard key={doc.id} doctor={doc} delay={i * 0.05} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
