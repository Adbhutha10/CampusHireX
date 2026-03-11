export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { redirect } from "next/navigation"
import { cn } from "@/backend/lib/utils"

export default async function CompanyApplicantsPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") redirect("/dashboard")

  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: {
      applications: {
        include: {
          student: { include: { user: true } }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  })

  if (!company) redirect("/dashboard/companies")

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <a href="/dashboard/companies" className="rounded-full p-2 hover:bg-accent transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </a>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applicants for {company.name}</h1>
          <p className="text-muted-foreground">{company.role} • {company.package}</p>
        </div>
      </div>

      <div className="card overflow-hidden shadow-sm border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30 border-b border-border">
                <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Student</th>
                <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Roll / Branch</th>
                <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">CGPA</th>
                <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Applied On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {company.applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground italic bg-accent/5">
                    No students have applied for this position yet.
                  </td>
                </tr>
              )}
              {company.applications.map((app) => (
                <tr key={app.id} className="hover:bg-accent/10 transition-all group">
                  <td className="px-6 py-5">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{app.student.user.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">{app.student.user.email}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-semibold text-foreground">{app.student.rollNumber}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">{app.student.branch}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-block px-3 py-1 bg-primary/5 text-primary rounded-lg font-black text-sm">{app.student.cgpa}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      app.status === "SELECTED" ? "bg-green-100 text-green-700 border-green-200" :
                      app.status === "REJECTED" ? "bg-red-100 text-red-700 border-red-200" :
                      app.status === "INTERVIEW_SCHEDULED" ? "bg-blue-100 text-blue-700 border-blue-200" :
                      "bg-secondary text-secondary-foreground border-border"
                    )}>
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-muted-foreground">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
