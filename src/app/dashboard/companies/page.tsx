export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import CompanyList from "@/app/dashboard/companies/CompanyList"
import { redirect } from "next/navigation"

export default async function CompaniesPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const companies = await prisma.company.findMany({
    include: {
      applications: {
        where: { student: { userId: session.user.id } }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const studentProfile = session.user.role === "STUDENT" 
    ? await prisma.studentProfile.findUnique({ where: { userId: session.user.id } })
    : null

  if (session.user.role === "STUDENT" && !studentProfile) {
    redirect("/dashboard/profile")
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">Placement Opportunities</h1>
          <p className="text-slate-500 font-medium text-lg mt-2">Explore current openings and manage company registrations.</p>
        </div>
        {session.user.role === "ADMIN" && (
           <a href="/dashboard/companies/new" className="btn btn-primary px-8 py-3 shadow-lg hover:shadow-primary/30 transition-all">
             Register New Company
           </a>
        )}
      </div>

      <CompanyList 
        companies={companies as any} 
        role={session.user.role} 
        studentCgpa={studentProfile?.cgpa || 0}
        studentId={studentProfile?.id || ""}
      />
    </div>
  )
}
