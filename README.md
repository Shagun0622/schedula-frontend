# 🩺 Schedula — Smart Healthcare Scheduling

A modern hospital management and appointment booking platform built with **Next.js 14**, **Tailwind CSS**, and **React**. Schedula connects patients with doctors through a clean, role-based interface.

---

## ✨ Features

### 👤 Authentication
- Login & Signup with role selection (Patient / Doctor)
- Persistent sessions via `localStorage`
- Demo credentials built-in for quick testing
- Password strength indicator & confirm password validation

### 🧑‍⚕️ Patient Portal
- Browse and search doctors by name or specialty
- Filter by specialization (Cardiology, Ophthalmology, Dermatology, etc.)
- View full doctor profiles — experience, ratings, hospital, hours
- **3-step booking flow:**
  1. View doctor profile
  2. Select date & time slot
  3. Fill patient info (name, age, disease, symptoms, notes)
- **Payment page** — Card, UPI (GPay, PhonePe, Paytm), Net Banking
- Promo codes (`FIRST50`, `HEALTH10`)
- View & manage appointments — Ongoing, Completed, Pending, Cancelled
- Expand appointment to see submitted patient info & symptoms
- Mark appointments as Completed or Cancel them
- Medical Records viewer
- Editable profile with avatar color picker

### 👨‍⚕️ Doctor Portal
- Dedicated doctor dashboard (role-gated)
- View all patients with search & status filters
- Patient summary cards — conditions, status, last visit
- Detailed patient pages with 3 tabs:
  - **Overview** — conditions, allergies, medications, patient info
  - **Vitals** — historical BP, pulse, temperature, oxygen readings
  - **History** — expandable visit history with notes & prescriptions
- Add clinical notes via modal
- Access restriction screen for non-doctors

---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| Next.js 14 | App Router, file-based routing |
| React 18 | UI, hooks, context |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| localStorage | Auth & appointment persistence |
| Context API | Global auth state |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/schedula.git
cd schedula

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 🧑‍⚕️ Patient | priya@example.com | password123 |
| 👨‍⚕️ Doctor | doctor@example.com | doctor123 |

---

## 📁 Project Structure

```
schedula/
├── app/
│   ├── page.jsx                        # Login page
│   ├── signup/
│   │   └── page.jsx                    # Signup page
│   ├── dashboard/
│   │   ├── layout.jsx                  # Dashboard layout + nav (role-based)
│   │   ├── page.jsx                    # Doctor listing / search
│   │   ├── doctor/[id]/
│   │   │   └── page.jsx               # Doctor profile + booking flow
│   │   ├── payment/
│   │   │   └── page.jsx               # Payment page
│   │   ├── appointments/
│   │   │   └── page.jsx               # Appointments manager
│   │   ├── patients/
│   │   │   ├── page.jsx               # Patient list (doctor only)
│   │   │   └── [id]/page.jsx          # Patient detail (doctor only)
│   │   ├── records/
│   │   │   └── page.jsx               # Medical records
│   │   └── profile/
│   │       └── page.jsx               # Editable profile
│   ├── globals.css
│   └── layout.jsx                      # Root layout
├── context/
│   └── AuthContext.jsx                 # Auth state & mock users
├── lib/
│   └── data.js                         # Mock doctors & patients data
├── jsconfig.json                       # Path alias (@/)
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## 🗺 Pages & Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Login |
| `/signup` | Public | Register as patient or doctor |
| `/dashboard` | Patient | Doctor search & listing |
| `/dashboard/doctor/[id]` | Patient | Doctor profile & booking |
| `/dashboard/payment` | Patient | Checkout & payment |
| `/dashboard/appointments` | Patient | Manage bookings |
| `/dashboard/records` | Both | Medical records |
| `/dashboard/profile` | Both | Edit profile |
| `/dashboard/patients` | Doctor only | Patient list |
| `/dashboard/patients/[id]` | Doctor only | Patient details |

---

## 💳 Payment Flow

```
Select Doctor → Choose Time Slot → Fill Patient Info → Payment Page → Confirmed
```

Supported methods:
- **Card** — formatted card number, expiry, CVV
- **UPI** — Google Pay, PhonePe, Paytm, or custom UPI ID
- **Net Banking** — bank selector

Promo codes:
- `FIRST50` — 50% off consultation fee
- `HEALTH10` — Flat ₹10 off

---

## 🔒 Role-Based Access

The app uses a `role` field (`"patient"` or `"doctor"`) stored in `localStorage` after login.

- **Patients** see: Find a Doctor, Appointments, Records, Profile
- **Doctors** see: My Patients, Appointments, Records, Profile
- Accessing a doctor-only page as a patient shows an **Access Restricted** screen
- Navigation adapts automatically based on role

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🚧 Limitations (Mock Data)

This is a frontend-only demo. The following are simulated:

- Auth uses hardcoded mock users (no real backend)
- Appointments are stored in `localStorage` (no database)
- Payment processing is simulated with a 2-second delay
- Medical records are static mock data
- Doctor availability is not real-time

---

## 🛣 Roadmap

- [ ] Backend API integration (Node.js / Supabase)
- [ ] Real authentication (NextAuth / JWT)
- [ ] Live doctor availability & calendar sync
- [ ] Push notifications for appointment reminders
- [ ] Video consultation integration
- [ ] PDF prescription download
- [ ] Admin panel for hospital management

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<p align="center">Built with ❤️ using Next.js & Tailwind CSS</p>
