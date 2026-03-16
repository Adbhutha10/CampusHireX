import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { redirect } from "next/navigation"
import { Briefcase, Building2, Clock, CheckCircle2, XCircle, Search, Filter, ArrowRight, ExternalLink, Target } from "lucide-react"
import { cn, formatDate } from "@/backend/lib/utils"
import { StatusUpdateSelect } from "./StatusUpdateSelect"
import { calculateMatchScore } from "@/backend/lib/matching"

export default async function ApplicationsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const applications = await prisma.application.findMany({
    where: session.user.role === "STUDENT" 
      ? { student: { userId: session.user.id } }
      : {},
    include: {
      company: true,
      student: { include: { user: true } }
    },
    orderBy: { updatedAt: "desc" }
  })

  // Calculate match scores for all applications
  const processedApps = applications.map(app => {
    const match = calculateMatchScore(
      app.student.skills,
      app.student.cgpa,
      (app.company as any).requiredSkills,
      app.company.criteria
    )
    return { ...app, match }
  })

  // Sort by match score if admin, to see top candidates first
  if (session.user.role === "ADMIN") {
    processedApps.sort((a, b) => b.match.score - a.match.score)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">Job Applications</h1>
        <p className="text-slate-500 font-medium text-lg mt-2">Manage and track all application statuses across the campus.</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 border border-white/40 relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-[80px] pointer-events-none" />
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Company</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{session.user.role === "ADMIN" ? "Student Candidate" : "Applied Role"}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Compatibility</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Current Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Application Date</th>
                {session.user.role === "ADMIN" && <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {processedApps.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                         <Briefcase size={32} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-bold text-slate-900">No applications found</p>
                        <p className="text-sm text-slate-400 font-medium tracking-tight">Try clearing filters or check back later for new updates.</p>
                      </div>
                      {session.user.role === "STUDENT" && (
                        <a href="/dashboard/companies" className="mt-4 bg-indigo-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                           Browse and Apply
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              {processedApps.map((app: any) => (
                <tr key={app.id} className="hover:bg-white/80 transition-all group/row relative">
                  <td className="px-8 py-6 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover/row:h-1/2 bg-indigo-600 rounded-r-full transition-all duration-300" />
                    <p className="font-extrabold text-slate-900 group-hover/row:text-indigo-600 transition-colors text-lg tracking-tight">{app.company.name}</p>
                  </td>
                  <td className="px-8 py-6">
                    {session.user.role === "ADMIN" ? (
                      <div>
                        <p className="font-extrabold text-slate-900">{app.student.user.name}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{app.student.rollNumber} • {app.student.branch}</p>
                      </div>
                    ) : (
                      <p className="font-extrabold text-slate-700">{app.company.role}</p>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border w-fit",
                        app.match.score >= 80 ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                        app.match.score >= 50 ? "bg-amber-50 text-amber-700 border-amber-100" :
                        "bg-slate-50 text-slate-600 border-slate-100"
                      )}>
                        <Target size={12} />
                        {app.match.score}% Fit
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 px-1 tracking-tight">
                        {app.match.isEligible ? "Meets Basic Criteria" : "Below CGPA Criteria"}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all group-hover/row:scale-105 inline-block",
                      app.status === "SELECTED" ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-100" :
                      app.status === "REJECTED" ? "bg-red-50 text-red-700 border-red-100 shadow-sm shadow-red-100" :
                      app.status === "INTERVIEW_SCHEDULED" ? "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm shadow-indigo-100" :
                      "bg-slate-50 text-slate-600 border-slate-100"
                    )}>
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-500">{formatDate(app.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Status changed {formatDate(app.updatedAt)}</p>
                  </td>
                  {session.user.role === "ADMIN" && (
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-opacity">
                        <StatusUpdateSelect applicationId={app.id} currentStatus={app.status} />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
