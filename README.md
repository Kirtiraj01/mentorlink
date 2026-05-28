# 🎓 Mentor Mentee Management System

**MentorLink** is a premium, full-stack AI-powered mentor-mentee intelligence platform designed for organizations and individuals to streamline mentorship management, track progress, and foster meaningful mentor-mentee relationships through data-driven insights.

---

## 🚀 Live Demo

> _Coming Soon — Deploy link will be added here._

---

## 📖 Description

MentorLink replaces traditional, manual mentorship tracking with an intelligent, data-driven dashboard. It provides actionable insights, automates engagement tracking, and delivers smart recommendations for both mentors and mentees. The application features a premium glassmorphism aesthetic with a dark theme, smooth micro-animations, and an intuitive SaaS-grade user experience.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **Vite** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Smooth animations & transitions |
| **Recharts** | Data visualization & charts |
| **Lucide React** | Icon library |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client for API calls |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **CORS** | Cross-Origin Resource Sharing |
| **Nodemon** | Development hot-reload |

### Architecture
- **Frontend**: React SPA served via Vite dev server (port 5173)
- **Backend**: Express REST API (port 5000)
- **Data**: In-memory mock JSON data architecture (Firebase/Firestore-ready)

---

## ✨ Features & Functionalities

### 🔐 Authentication
- Role-based login system supporting three user types: **Admin**, **Mentor**, and **Mentee**
- Protected routes with authentication context
- Session management and user profile handling

### 📊 Dashboard (Role-Specific)
- **Admin Dashboard**: Full system overview with analytics, risk detection, and mentor/mentee management
- **Mentor Dashboard**: View assigned mentees, session tracking, and workload indicators
- **Mentee Dashboard**: Personal progress tracking, achievement badges, and activity heatmap

### 👥 User Management
- **Mentors Page**: Browse and manage mentor profiles, view load indicators (Light / Optimal / Overloaded)
- **Mentees Page**: View all mentee profiles with risk status classification
- **Profile Page**: Individual user profile management

### 📅 Session Management
- Schedule, track, and review mentoring sessions
- Session history with timestamps and notes
- Session analytics and frequency tracking

### 📈 Progress & Analytics
- **Progress Page**: Visual progress rings and milestone tracking
- **Analytics Route**: Aggregated system-wide metrics for admins
- **Activity Heatmap**: 12-week GitHub-style contribution grid showing engagement frequency
- **Relationship Intelligence Score**: Dynamic 0–100 score reflecting mentorship pairing strength

### 🚨 Issues & Alerts
- Issue tracking system with priority levels
- Alert management for at-risk mentees
- Proactive risk detection (At Risk vs. Healthy classification)

### 💬 Feedback System
- Structured feedback submission for sessions
- Feedback review and history
- Rating and comment system

### 🤖 Smart Recommendations
- AI-driven, rule-based suggestion panel
- Personalized next-best-action guidance for mentors and mentees
- Mentor Load Indicator with visual cues

### 🎨 UI/UX Features
- Premium glassmorphism dark theme (deep blues, teals, purples)
- Fully responsive design across all screen sizes
- Smooth micro-animations via Framer Motion
- Reusable component library: `StatCard`, `Badge`, `Skeleton`, `ProgressRing`, `Heatmap`, `LoadIndicator`, `RecommendationPanel`
- Sidebar & Navbar navigation system

---

## 📁 Project Structure

```
Mentorlink-final-project/
├── client/                     # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                # Axios API service layer
│   │   ├── assets/             # Static assets
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Badge.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Heatmap.jsx
│   │   │   ├── LoadIndicator.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProgressRing.jsx
│   │   │   ├── RecommendationPanel.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   └── StatCard.jsx
│   │   ├── context/            # React context (Auth, etc.)
│   │   ├── data/               # Mock data / fixtures
│   │   ├── layouts/            # Page layout wrappers
│   │   ├── pages/              # Route-level page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── Issues.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Mentees.jsx
│   │   │   ├── Mentors.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Progress.jsx
│   │   │   └── Sessions.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Node.js + Express backend
│   ├── data/                   # Mock JSON data store
│   ├── routes/                 # API route handlers
│   │   ├── alerts.js
│   │   ├── analytics.js
│   │   ├── issues.js
│   │   ├── sessions.js
│   │   ├── syllabus.js
│   │   └── users.js
│   ├── index.js                # Express server entry point
│   └── package.json
│
├── check.js                    # Utility/debug script
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** v18+ and **npm** v9+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Kirtiraj01/mentorlink.git
cd mentorlink
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Run the Backend Server

```bash
cd server
npm run dev
# Server starts at http://localhost:5000
```

### 5. Run the Frontend (in a new terminal)

```bash
cd client
npm run dev
# Frontend starts at http://localhost:5173
```

### 6. Open the App

Open your browser and navigate to: **http://localhost:5173**

---

## 🔑 Demo Login Credentials

| Role | Use Case |
|---|---|
| **Admin** | Full system access, analytics, user management |
| **Mentor** | Manage mentees, track sessions, view workload |
| **Mentee** | View progress, track sessions, get recommendations |

> _Check the login page for demo credentials or configure them in `server/data/`._

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Fetch all users |
| GET | `/api/sessions` | Get all sessions |
| GET | `/api/issues` | Get all issues |
| GET | `/api/alerts` | Get system alerts |
| GET | `/api/analytics` | Get analytics data |
| GET | `/api/syllabus` | Get syllabus data |

---

## 👨‍💻 Team Members

- Member 1
- Member 2

---

## 📸 Screenshots

> _Screenshots will be added here after deployment._

| Page | Preview |
|---|---|
| Login | _Coming Soon_ |
| Admin Dashboard | _Coming Soon_ |
| Mentor Dashboard | _Coming Soon_ |
| Mentee Dashboard | _Coming Soon_ |
| Sessions | _Coming Soon_ |
| Issues | _Coming Soon_ |

---

## 📄 License

This project is submitted as a Mini Project for academic evaluation. All rights reserved.

---

<div align="center">
  <strong>Built with ❤️ using React + Node.js + Express</strong>
</div>
