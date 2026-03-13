// ─────────────────────────────────────────────────────────────────────────────
//  SyncHealth — Centralised Validation Utilities
//  All form validators return an object: { field: "error message" }
//  Empty object {} means valid.
// ─────────────────────────────────────────────────────────────────────────────

// ── Primitives ────────────────────────────────────────────────────────────────

export const isEmpty = (v) => v === null || v === undefined || String(v).trim() === "";

export const isValidEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

/** Pakistani mobile numbers: +923XXXXXXXXX  or  03XXXXXXXXXX (11 digits after 0) */
export const isValidPakPhone = (v) =>
  /^(\+92)[0-9]{10}$|^0[0-9]{10}$/.test(String(v).trim());

/** PMC format: PMC- followed by digits (uppercase enforced on input) */
export const isValidPMC = (v) =>
  /^PMC-[0-9]{3,10}$/i.test(String(v).trim());

export const isPositiveInt = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0;
};

export const isInRange = (v, min, max) => {
  const n = Number(v);
  return !isNaN(n) && n >= min && n <= max;
};

// ── Password strength  (0-4) ──────────────────────────────────────────────────
export const passwordStrength = (pw = "") => {
  let score = 0;
  if (pw.length >= 8)            score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^a-zA-Z0-9]/.test(pw))  score++;
  return score;
};

export const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];
export const STRENGTH_COLOR = ["", "#c0392b", "#e5a623", "#4A7C59", "#2e7d32"];

// ── Login ─────────────────────────────────────────────────────────────────────
export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (isEmpty(email))          errors.email    = "Email is required.";
  else if (!isValidEmail(email)) errors.email  = "Enter a valid email address.";
  if (isEmpty(password))       errors.password = "Password is required.";
  return errors;
};

// ── Patient — Step 1 (Account) ────────────────────────────────────────────────
export const validatePatientAccount = ({ full_name, email, password, phone }) => {
  const errors = {};

  if (isEmpty(full_name))
    errors.full_name = "Full name is required.";
  else if (full_name.trim().length < 2)
    errors.full_name = "Name must be at least 2 characters.";

  if (isEmpty(email))
    errors.email = "Email is required.";
  else if (!isValidEmail(email))
    errors.email = "Enter a valid email address.";

  if (isEmpty(password))
    errors.password = "Password is required.";
  else if (password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  else if (passwordStrength(password) < 2)
    errors.password = "Password is too weak. Add uppercase letters or numbers.";

  if (!isEmpty(phone) && !isValidPakPhone(phone))
    errors.phone = "Use format +923XXXXXXXXX or 03XXXXXXXXXX.";

  return errors;
};

// ── Patient — Step 2 (Profile) ────────────────────────────────────────────────
export const validatePatientProfile = ({
  age, gender, city,
  emergency_contact_name, emergency_contact_phone,
}) => {
  const errors = {};

  if (isEmpty(age))
    errors.age = "Age is required.";
  else if (!isInRange(age, 1, 120))
    errors.age = "Enter a valid age between 1 and 120.";

  if (isEmpty(gender))
    errors.gender = "Please select a gender.";

  if (isEmpty(city))
    errors.city = "Please select your city.";

  if (isEmpty(emergency_contact_name))
    errors.emergency_contact_name = "Emergency contact name is required.";
  else if (emergency_contact_name.trim().length < 2)
    errors.emergency_contact_name = "Enter a valid name.";

  if (isEmpty(emergency_contact_phone))
    errors.emergency_contact_phone = "Emergency contact phone is required.";
  else if (!isValidPakPhone(emergency_contact_phone))
    errors.emergency_contact_phone = "Use format +923XXXXXXXXX or 03XXXXXXXXXX.";

  return errors;
};

// ── Doctor — Step 1 (Account) ─────────────────────────────────────────────────
export const validateDoctorAccount = ({ full_name, email, password, phone }) =>
  // Same rules as patient account
  validatePatientAccount({ full_name, email, password, phone });

// ── Doctor — Step 2 (Professional) ───────────────────────────────────────────
export const validateDoctorProfessional = ({
  pmc_number, specialty, city, years_of_experience,
}) => {
  const errors = {};

  if (isEmpty(pmc_number))
    errors.pmc_number = "PMC number is required.";
  else if (!isValidPMC(pmc_number))
    errors.pmc_number = "Format must be PMC- followed by digits (e.g. PMC-12345).";

  if (isEmpty(specialty))
    errors.specialty = "Please select a specialty.";

  if (isEmpty(city))
    errors.city = "Please select your city.";

  if (!isEmpty(years_of_experience) && !isInRange(years_of_experience, 0, 50))
    errors.years_of_experience = "Years of experience must be between 0 and 50.";

  return errors;
};

// ── Doctor — Step 3 (Fees) ────────────────────────────────────────────────────
export const validateDoctorFees = ({ online_fee, physical_fee, home_visit_fee }) => {
  const errors = {};

  if (isEmpty(online_fee))
    errors.online_fee = "Online fee is required.";
  else if (!isPositiveInt(online_fee) || Number(online_fee) < 100)
    errors.online_fee = "Minimum fee is PKR 100.";
  else if (Number(online_fee) > 100000)
    errors.online_fee = "Fee seems too high. Max PKR 100,000.";

  if (isEmpty(physical_fee))
    errors.physical_fee = "Physical consultation fee is required.";
  else if (!isPositiveInt(physical_fee) || Number(physical_fee) < 100)
    errors.physical_fee = "Minimum fee is PKR 100.";
  else if (Number(physical_fee) > 100000)
    errors.physical_fee = "Fee seems too high. Max PKR 100,000.";

  if (!isEmpty(home_visit_fee)) {
    if (!isPositiveInt(home_visit_fee) || Number(home_visit_fee) < 100)
      errors.home_visit_fee = "Minimum fee is PKR 100.";
    else if (Number(home_visit_fee) > 200000)
      errors.home_visit_fee = "Fee seems too high. Max PKR 200,000.";
  }

  return errors;
};
