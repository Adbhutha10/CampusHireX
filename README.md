# CampusHireX – A Smart Platform for Efficient Campus Recruitment

**CampusHireX** is a premium, full-stack recruitment command center designed to bridge the gap between ambitious students and elite visiting companies. It transforms the traditionally manual, spreadsheet-heavy placement process into a streamlined, automated, and data-driven ecosystem.

---

## 🏛️ Project Architecture & Structure

The project follows a **Modular Full-Stack Architecture**, logically separating concerns for high maintainability and scalability.

### **`src/backend/`**
- **`lib/`**: The engine room. Contains `prisma.ts` (Database), `auth.ts` (Security), and `notifications.ts` (Communication logic).
- **`actions/`**: Server-side business logic and form handlers (e.g., `register.ts`).
- **`auth.ts`**: Centralized authentication configuration using Auth.js v5.

### **`src/frontend/`**
- **`components/`**: Reusable UI blocks (Sidebar, Dashboard layouts, Glassmorphism cards).
- **`styles/`**: Global Design System tokens and Tailwind CSS 4 configurations.

### **`src/shared/`**
- **`types/`**: Unified TypeScript interfaces shared across frontend and backend for absolute type safety.

### **`src/app/`**
- **`api/`**: RESTful Route Handlers.
- **Dashboard Pages**: Role-based routing for Students and Administrators.

---

## 🚀 Technical Stack & Rationale

| Technology | Role | Rationale |
| :--- | :--- | :--- |
| **Next.js 15+** | Full-Stack Framework | Provides a unified development experience with Server Actions and lightning-fast Turbopack compilation. |
| **Auth.js v5** | Security & RBAC | Industry-standard authentication with built-in Role-Based Access Control (RBAC). |
| **Prisma ORM** | Data Layer | Type-safe database queries and automated schema migrations. |
| **MySQL** | Database Engine | Robust, relational data storage suitable for complex student-application relationships. |
| **Tailwind CSS 4** | Design System | Enables rapid implementation of "Xyzon" premium aesthetics with utility-first efficiency. |
| **Recharts** | Analytics | High-performance visualization of recruitment funnels and skill trends. |
| **Lucide React** | Visual Language | A consistent, lightweight icon library for an intuitive user interface. |

---

## ✨ Features & Capabilities

### **💎 The "Wow" Factor: Standard Features**
- **Dynamic UX**: Real-time greeting logic and personalized dashboards.
- **Glassmorphism UI**: High-density, modern interface with subtle micro-animations.
- **Mobile First**: Fully responsive layouts optimized for all device sizes.
- **Notification Engine**: Integrated alerts for schedule changes and selection results.

### **🎓 Student Experience**
- **Profile Strength Meter**: Real-time feedback on profile completion and placement readiness.
- **Skill Repository**: Showcase technical proficiencies and LinkedIn/GitHub portfolios.
- **One-Click Application**: Apply to eligible companies instantly.
- **Automatic Matching**: The engine matches students with jobs based on CGPA and skill criteria.
- **Quick Actions Hub**: Fast access to resumes, applications, and upcoming schedules.

### **🏛️ Administrator Command Center**
- **Recruitment Funnel**: Visual tracking of conversion rates from "Applied" to "Selected".
- **Talent Demand Analytics**: Data-driven insights into top skills required by visiting recruiters.
- **Advanced Directory**: High-performance student search with branch and CGPA filters.
- **Hall of Fame**: A selection celebration hub that dynamically banners recently placed students.
- **Company Lifecycle**: full CRUD operations for managing visiting company profiles and deadlines.

---

## 🔥 Implemented Core Features

### **1. Cloud Storage & Resume Management (Feature #1)**
**CampusHireX** utilizes **UploadThing** for high-performance, secure file handling.
- **Workflow**: Students can upload their resumes directly from the Profile Command Center. 
- **Server-Side Integration**: Uploaded files are automatically associated with the student's database profile.
- **Security**: Strict file type validation (PDF only) and size limits.
- **Components**: Custom `ProfileForm.tsx` with drag-and-drop support.

### **2. Automated External Notification Engine (Feature #2)**
A mission-critical communication layer built with **Resend** and **React Email**.
- **Automated Alerts**: Students receive beautifully formatted, branded emails for:
  - **Application Success**: Immediate confirmation upon applying to a company.
  - **Status Updates**: Real-time alerts when Shortlisted, Selected, or Rejected.
  - **Interview Invites**: Direct calendar-friendly emails when an interview is scheduled.
- **Branded Design**: Utilizes custom React templates with "Electric Green" (Success) and "Signal Orange" (Action Required) accents.
- **Architecture**: Low-latency delivery triggered via server-side notification hooks.

### **3. Automated Testing Suite (Feature #3)**
A dual-layer testing strategy ensuring platform reliability using **Vitest** and **Playwright**.
- **Unit & Integration Tests (Vitest)**: Verify backend logic in isolation, including the notification engine and database utilities. Tests are located in `src/__tests__/`.
- **End-to-End Tests (Playwright)**: Simulate real user journeys in a browser (login flow, portal navigation). Tests are located in `tests/`.
- **Commands**:
  ```bash
  npx vitest run      # Run all unit tests (one-shot)
  npm run test:e2e    # Launch browser-based E2E tests
  ```

### **4. CI/CD Pipeline (Feature #4)**
Automated quality assurance powered by **GitHub Actions**, running on every push to `main`.
- **Linting**: `npx eslint src` — ensures code style consistency.
- **Type-Checking**: `tsc --noEmit` — verifies full TypeScript safety.
- **Unit Tests**: `npx vitest run` — runs the full test suite.
- **Workflow File**: `.github/workflows/ci.yml`
- **Verification**: Visit the **Actions** tab on the GitHub repository to see live results.

### **5. Real-Time Capabilities (Feature #5)**
Instant, live updates for students and admins powered by **Pusher**.
- **Live Notifications**: Students receive immediate, branded toast notifications the second an admin updates their application status.
- **Serverless WebSockets**: Optimized for Next.js 15, using Pusher Channels to bypass cold starts and traditional socket limitations.
- **Global Listener**: A dedicated `RealTimeNotifications` component listens for events across the entire dashboard.
- **UI Feedback**: Utilizes `react-hot-toast` for high-visibility, professional-grade alerts.

### **6. CampusScore™ Matching Algorithm (Feature #6)**
A multi-factor compatibility engine that automatically ranks jobs for students and candidates for recruiters.
- **Dual-Factor Scoring**:
  - **Skill Alignment (70%)**: Direct comparison of student skills vs. company required skills.
  - **Academic Eligibility (30%)**: Relative scoring based on CGPA criteria.
- **Student Insights**: Companies are automatically sorted by match score, showing matched and missing skills on each job card.
- **Admin Analytics**: Applicants are ranked by their "Fit Score", allowing admins to focus on top talent first.
- **Logic Engine**: `src/backend/lib/matching.ts`

### **7. Production Error Tracking (Feature #7)**
Real-time crash reporting powered by **Sentry**, capturing errors in all environments.
- **Full Coverage**: Monitors browser errors (client), API route crashes (server), and Edge middleware.
- **Global Error Boundary**: A branded "Something went wrong" page is shown to users, while the full stack trace is silently sent to Sentry.
- **Stack Traces**: Source maps are uploaded during build for human-readable error location.
- **Config Files**: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`

### **8. Database Environment Cleanup (Feature #8)**
Ensures the production database (MySQL) is the sole active data source.
- **Removed**: Unused `dev.db` and `prisma/dev.db` SQLite files left over from initial scaffolding.
- **Gitignored**: Added `*.db` and `*.db-journal` to `.gitignore` — no accidental commits possible.
- **Result**: The app exclusively uses **MySQL** (`campus_hire_x` schema).

### **9. Code Formatting Tooling (Feature #9)**
Enforced consistent code style across the entire codebase using **Prettier**.
- **Config**: `.prettierrc` with project-standard settings (2-space indent, no semicolons, `es5` trailing commas).
- **Ignore**: `.prettierignore` excludes `node_modules`, `.next`, `build`, and migration files.
- **Commands**:
  ```bash
  npm run format        # Auto-format all source files
  npm run format:check  # Check formatting (used in CI)
  ```

---

## 🛠️ Installation & Setup

### **1. Environment Config**
Create a `.env` file with all required keys:
```env
# Core
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/campus_hire_x"
AUTH_SECRET="your-32-char-secret-key"

# Feature 1: Resume Uploads (UploadThing)
UPLOADTHING_TOKEN="your_uploadthing_token"

# Feature 2: External Notification Engine (Resend)
RESEND_API_KEY="your_resend_api_key"

# Feature 7: Error Tracking (Sentry)
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"

# Feature 5: Real-Time Capabilities (Pusher)
PUSHER_APP_ID="your_id"
PUSHER_KEY="your_key"
PUSHER_SECRET="your_secret"
NEXT_PUBLIC_PUSHER_KEY="your_key"
NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
```

### **2. Launch Sequence**
```bash
npm install          # Install dependencies
npx prisma generate  # Sync database client
npx prisma db push   # Deploy schema
npm run dev          # Start development server
```

---

## ✅ Feature Verification Guide

### Feature 2 – Email Notifications
1. Register as a Student and apply to a company.
2. As Admin, change the application status to **Selected**.
3. Check the student's inbox — a branded status update email should arrive.

### Feature 3 – Automated Testing
```bash
npx vitest run     # Should show: 2 passed
npm run test:e2e   # Should show: 2 passed (Chromium)
```

### Feature 4 – CI/CD Pipeline
1. Push any commit to the `main` branch on GitHub.
2. Go to **GitHub → Actions** tab.
3. The **"CampusHireX CI"** workflow should show a ✅ green checkmark.

### Feature 7 – Sentry Error Tracking
1. Ensure your Sentry DSN is in `.env`.
2. Open your browser's console on `localhost:3000`.
3. Trigger any unhandled error (e.g., navigate to a broken route).
4. Visit your **[Sentry Dashboard](https://sentry.io)** — the error should appear within seconds.

---
*Built for modern institutions. Engineered by Durgam Vaishnavi.*
