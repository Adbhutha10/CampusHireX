export const dynamic = "force-dynamic"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Building2, Users, Briefcase, Trophy } from "lucide-react"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) redirect("/login")

  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } })
  const totalCompanies = await prisma.company.count()
  const totalApplications = await prisma.application.count()
  const placedStudents = await prisma.application.count({ where: { status: "SELECTED" } })

  if (session.user.role === "ADMIN") {
    const recentApplications = await prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { student: { include: { user: true } }, company: true }
    })

    const branchData = await prisma.studentProfile.groupBy({
      by: ['branch'],
      _count: { _all: true },
    }).then(async groups => {
      const placed = await prisma.studentProfile.findMany({
        where: { applications: { some: { status: "SELECTED" } } },
        select: { branch: true }
      })
      
      return groups.map(g => ({
        name: g.branch,
        total: g._count._all,
        placed: placed.filter(p => p.branch === g.branch).length
      }))
    })

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium text-lg mt-2">Overview of campus placement activity.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Students" value={totalStudents} icon={Users} />
          <StatCard title="Companies" value={totalCompanies} icon={Building2} />
          <StatCard title="Applications" value={totalApplications} icon={Briefcase} />
          <StatCard title="Placed" value={placedStudents} icon={Trophy} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Branch-wise Performance</h3>
            <div className="h-[300px]">
               <div className="text-xs text-muted-foreground italic mb-4">Live analytics active.</div>
               <div className="space-y-4">
                  {branchData.map(b => (
                    <div key={b.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                        <span>{b.name}</span>
                        <span>{b.placed} / {b.total} Placed</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(b.placed/b.total)*100}%` }} />
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activities</h3>
            <div className="space-y-4">
              {recentApplications.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No recent placement activity.</p>
              ) : (
                recentApplications.map(app => (
                  <div key={app.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">{app.student.user.name} <span className="text-slate-500 font-medium">applied to</span> {app.company.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        {new Date(app.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Student Dashboard logic
  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: { applications: { include: { company: true } } }
  })

  // Redirect to profile if not completed
  if (!student && session.user.role === "STUDENT") {
    redirect("/dashboard/profile")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">Student Dashboard</h1>
        <p className="text-slate-500 font-medium text-lg mt-2">Welcome back, <span className="text-indigo-600">{session.user.name}</span>. Track your progress here.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Applied" value={student?.applications.length || 0} icon={Briefcase} />
        <StatCard title="Interviews" value={student?.applications.filter((a: any) => a.status === "INTERVIEW_SCHEDULED").length || 0} icon={Trophy} />
        <StatCard title="Status" value={student?.applications.some((a: any) => a.status === "SELECTED") ? "Selected" : "In Progress"} icon={Users} />
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Your Recent Applications</h3>
        {!student?.applications.length ? (
          <div className="text-center py-10 bg-accent/10 rounded-xl border border-dashed">
            <p className="text-muted-foreground mb-4">You haven&apos;t applied to any companies yet.</p>
            <a href="/dashboard/companies" className="btn btn-primary">Browse Companies</a>
          </div>
        ) : (
          <div className="space-y-4">
            {student.applications.map((app: any) => (
              <div key={app.id} className="flex items-center justify-between border-b border-slate-50 pb-5 pt-2 last:border-0 last:pb-0 group hover:bg-slate-50 px-4 -mx-4 rounded-xl transition-colors">
                <div>
                  <p className="text-lg font-bold text-slate-900">{app.company.name}</p>
                  <p className="text-sm font-medium text-slate-500">{app.company.role} • {app.company.package}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {app.status.replace("_", " ")}
                  </span>
                  <p className="text-[10px] font-medium text-slate-400">Updated {new Date(app.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon }: { title: string, value: number | string, icon: any }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all flex items-center gap-5">
      <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-4xl font-extrabold text-slate-900">{value}</p>
      </div>
    </div>
  )
}
