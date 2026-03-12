# Sync Health — Frontend

React + Tailwind CSS frontend for the Sync Health platform.

---

## Project Structure

```
sync-health/
├── src/
│   ├── pages/
│   │   ├── Login.jsx                    /login
│   │   ├── PatientRegister.jsx          /register/patient
│   │   ├── DoctorRegister.jsx           /register/doctor
│   │   ├── DoctorDirectory.jsx          /doctors
│   │   ├── DoctorProfile.jsx            /doctors/:id
│   │   ├── PatientDashboard.jsx         /patient/dashboard
│   │   ├── PatientProfilePage.jsx       /patient/profile
│   │   ├── DoctorDashboard.jsx          /doctor/dashboard
│   │   ├── DoctorProfileEdit.jsx        /doctor/profile/edit
│   │   └── ConsultationNotes.jsx        /doctor/appointments/:id/notes
│   ├── components/
│   │   ├── Navbar.jsx                   Shared navigation
│   │   ├── Footer.jsx                   Shared footer
│   │   └── ProtectedRoute.jsx           Auth guard wrapper
│   ├── context/
│   │   └── AuthContext.jsx              Auth state (user, token, login, logout)
│   ├── services/
│   │   ├── authService.js               POST /auth/login, /auth/register
│   │   ├── patientService.js            GET/PUT /patients/me
│   │   └── doctorService.js             GET/POST /doctors, /doctors/:id, etc.
│   ├── App.jsx                          Routes
│   ├── main.jsx                         Entry point
│   └── index.css                        Global styles + font imports
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

---

## Page Dependencies

| Page | Depends on |
|------|-----------|
| All pages | Navbar, Footer |
| PatientDashboard, PatientProfile | AuthContext (patient role) |
| DoctorDashboard, DoctorProfileEdit, ConsultationNotes | AuthContext (doctor role) |
| PatientRegister | authService, patientService |
| DoctorRegister | authService, doctorService |
| Login | authService, AuthContext |
| DoctorDirectory | doctorService |
| DoctorProfile | doctorService, AuthContext |

---

## Design Tokens

| Token | Value |
|-------|-------|
| Moss Green | `#2E4036` |
| Clay Orange | `#CC5833` |
| Cream | `#F2F0E9` |
| Charcoal | `#1A1A1A` |
| Heading font | Plus Jakarta Sans |
| Body font | Outfit |
| Accent italic | Cormorant Garamond |
| Mono / labels | IBM Plex Mono |

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your backend URL

# 3. Run dev server
npm run dev
```

The app runs at http://localhost:5173

---

## Notes

- All pages use placeholder/mock data gracefully when the backend is offline — great for frontend-only demos
- Auth token is stored in localStorage under `sync_auth`
- ProtectedRoute redirects unauthenticated users to /login
- Doctors get redirected to /doctor/dashboard, patients to /patient/dashboard
