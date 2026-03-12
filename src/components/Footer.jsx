import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="rounded-t-[4rem] pt-16 pb-10 px-8 mt-20"
      style={{ background: "#2E4036" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <p
              className="text-2xl font-bold mb-3"
              style={{ color: "#F2F0E9", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Sync
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#F2F0E9", opacity: 0.6, fontFamily: "'Outfit', sans-serif" }}>
              AI-powered healthcare connecting Pakistani patients with the right specialists, faster.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#F2F0E9", opacity: 0.4, fontFamily: "'IBM Plex Mono', monospace" }}>
              Platform
            </p>
            <div className="flex flex-col gap-2">
              {[["Find Doctors", "/doctors"], ["For Doctors", "/for-doctors"], ["Sign Up", "/register/patient"]].map(([label, href]) => (
                <Link key={href} to={href} className="text-sm transition-opacity hover:opacity-100" style={{ color: "#F2F0E9", opacity: 0.6, fontFamily: "'Outfit', sans-serif" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#F2F0E9", opacity: 0.4, fontFamily: "'IBM Plex Mono', monospace" }}>
              Account
            </p>
            <div className="flex flex-col gap-2">
              {[["Login", "/login"], ["Patient Register", "/register/patient"], ["Doctor Register", "/register/doctor"]].map(([label, href]) => (
                <Link key={href} to={href} className="text-sm transition-opacity hover:opacity-100" style={{ color: "#F2F0E9", opacity: 0.6, fontFamily: "'Outfit', sans-serif" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex items-center justify-between">
          <p className="text-xs" style={{ color: "#F2F0E9", opacity: 0.4, fontFamily: "'IBM Plex Mono', monospace" }}>
            &copy; {new Date().getFullYear()} Sync Health
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs" style={{ color: "#F2F0E9", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}>
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
