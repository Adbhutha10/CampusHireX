import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { cn } from "@/lib/utils"
import { StatusUpdateSelect } from "./StatusUpdateSelect"

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">Job Applications</h1>
        <p className="text-slate-500 font-medium text-lg mt-2">Manage and track all application statuses across the campus.</p>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Company</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{session.user.role === "ADMIN" ? "Student" : "Role"}</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Applied On</th>
                {session.user.role === "ADMIN" && <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400 italic bg-slate-50">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg font-medium">No applications record found.</p>
                      {session.user.role === "STUDENT" && <a href="/dashboard/companies" className="text-indigo-600 font-bold hover:underline">Apply to your first company here</a>}
                    </div>
                  </td>
                </tr>
              )}
              {applications.map((app: any) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg">{app.company.name}</p>
                  </td>
                  <td className="px-6 py-5">
                    {session.user.role === "ADMIN" ? (
                      <div>
                        <p className="font-bold text-slate-900">{app.student.user.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{app.student.rollNumber} • {app.student.branch}</p>
                      </div>
                    ) : (
                      <p className="font-bold text-slate-700">{app.company.role}</p>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      app.status === "SELECTED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      app.status === "REJECTED" ? "bg-red-50 text-red-700 border-red-100" :
                      app.status === "INTERVIEW_SCHEDULED" ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                      "bg-slate-50 text-slate-600 border-slate-100"
                    )}>
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">
                    {new Date(app.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  {session.user.role === "ADMIN" && (
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-3 translate-x-1 group-hover:translate-x-0 transition-all">
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
