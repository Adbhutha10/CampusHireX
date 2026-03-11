# CampusHireX – A Smart Platform for Efficient Campus Recruitment

CampusHireX is a premium, full-stack recruitment portal designed to bridge the gap between visiting companies and eligible students. It offers a streamlined workflow for administrators to manage placements and for students to track their career opportunities.

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) for high-end UI/UX
- **Database**: [MySQL](https://www.mysql.com/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Auth.js v5](https://authjs.dev/) (NextAuth)
- **Visualization**: [Recharts](https://recharts.org/) for placement analytics
- **Icons**: [Lucide React](https://lucide.dev/)

## ✨ Key Features

### 🏛️ For Administrators
- **Placement Analytics**: Real-time charts showing branch-wise performance and placement rates.
- **Company Management**: Post and manage job openings with CTC, eligibility criteria, and deadlines.
- **Student Directory**: Centralized list of students with comprehensive filters and CSV export.
- **Application Tracking**: Monitor student applications and update selection statuses.
- **Interview Scheduler**: Assign specific slots and venues for shortlisted candidates.

### 🎓 For Students
- **Smart Profile**: Manage academic records, technical skills, and digital resumes.
- **Eligibility Engine**: Automatically filters companies based on CGPA criteria.
- **One-Click Apply**: Seamless application process for visiting companies.
- **Real-time Tracking**: Stay updated on interview schedules and selection results.

## 🛠️ Getting Started

### 1. Clone & Install
```bash
git clone <repository-url>
cd campus-hire-x
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/campus_hire_x"
AUTH_SECRET="your-32-char-secret-key"
```

### 3. Database Initialization
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

- `src/app`: App Router pages, layouts, and API endpoints.
- `src/components`: UI components (Sidebar, Dashboard cards, etc.).
- `src/lib`: Database (Prisma) and Auth.js configurations.
- `prisma`: Database schema definition (`schema.prisma`).
- `public`: Static assets and icons.

---
Built for modern campus recruitment workflows.
