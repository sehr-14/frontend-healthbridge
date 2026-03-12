import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import PatientRegister from "./pages/PatientRegister";
import DoctorRegister from "./pages/DoctorRegister";
import DoctorDirectory from "./pages/DoctorDirectory";
import DoctorProfile from "./pages/DoctorProfile";
import PatientDashboard from "./pages/PatientDashboard";
import PatientProfilePage from "./pages/PatientProfilePage";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorProfileEdit from "./pages/DoctorProfileEdit";
import ConsultationNotes from "./pages/ConsultationNotes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/doctors" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/patient" element={<PatientRegister />} />
          <Route path="/register/doctor" element={<DoctorRegister />} />
          <Route path="/doctors" element={<DoctorDirectory />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/patient/dashboard" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/profile" element={<ProtectedRoute role="patient"><PatientProfilePage /></ProtectedRoute>} />
          <Route path="/doctor/dashboard" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/profile/edit" element={<ProtectedRoute role="doctor"><DoctorProfileEdit /></ProtectedRoute>} />
          <Route path="/doctor/appointments/:id/notes" element={<ProtectedRoute role="doctor"><ConsultationNotes /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
