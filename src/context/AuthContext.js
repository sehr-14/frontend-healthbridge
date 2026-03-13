import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken]             = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sync_auth");
      if (stored) {
        const { token: t, user } = JSON.parse(stored);
        if (t && user) { setToken(t); setCurrentUser(user); }
      }
    } catch {
      localStorage.removeItem("sync_auth");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = ({ access_token, user }) => {
    localStorage.setItem("sync_auth", JSON.stringify({ token: access_token, user }));
    setToken(access_token);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem("sync_auth");
    sessionStorage.removeItem("doctor_review_banner");
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, loading, isAuthenticated: !!token, role: currentUser?.role ?? null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
