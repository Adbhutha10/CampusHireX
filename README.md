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

## 🛠️ Installation & Setup

### **1. Environment Config**
Create a `.env` file:
```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/campus_hire_x"
AUTH_SECRET="your-32-char-secret-key"
```

### **2. Launch Sequence**
```bash
npm install          # Install dependencies
npx prisma generate  # Sync database client
npx prisma db push   # Deploy schema
npm run dev          # Start development server
```

---
*Built for modern institutions. Engineered by Durgam Vaishnavi.*
