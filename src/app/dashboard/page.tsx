import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { Building2, Users, Briefcase, Trophy, Sparkles, CheckCircle2, ArrowRight, ExternalLink, PenLine, Search, CalendarClock } from "lucide-react"
import { redirect } from "next/navigation"
import { cn, formatDate } from "@/backend/lib/utils"
import Link from "next/link"

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

    const funnelData = {
      applied: await prisma.application.count(),
      shortlisted: await prisma.application.count({ where: { status: "SHORTLISTED" } }),
      interviewed: await prisma.application.count({ where: { status: "INTERVIEW_SCHEDULED" } }),
      selected: await prisma.application.count({ where: { status: "SELECTED" } }),
    }

    const studentsWithSkills = await prisma.studentProfile.findMany({
      select: { skills: true }
    })

    const skillCounts: Record<string, number> = {}
    studentsWithSkills.forEach(s => {
      s.skills.split(',').forEach(skill => {
        const trimmed = skill.trim()
        if (trimmed) skillCounts[trimmed] = (skillCounts[trimmed] || 0) + 1
      })
    })

    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }))

    const recentSuccess = await prisma.application.findMany({
      where: { status: "SELECTED" },
      take: 3,
      orderBy: { updatedAt: "desc" },
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Students" value={totalStudents} icon={Users} theme="blue" />
          <StatCard title="Companies" value={totalCompanies} icon={Building2} theme="purple" />
          <StatCard title="Applications" value={totalApplications} icon={Briefcase} theme="amber" />
          <StatCard title="Placed" value={placedStudents} icon={Trophy} theme="emerald" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recruitment Funnel */}
          <div className="lg:col-span-1 bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border border-white/40 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              Recruitment Funnel
            </h3>
            <div className="space-y-6">
              {[
                { label: "Applied", count: funnelData.applied, color: "bg-indigo-500", total: funnelData.applied },
                { label: "Shortlisted", count: funnelData.shortlisted, color: "bg-blue-500", total: funnelData.applied },
                { label: "Interviewed", count: funnelData.interviewed, color: "bg-amber-500", total: funnelData.applied },
                { label: "Selected", count: funnelData.selected, color: "bg-emerald-500", total: funnelData.applied }
              ].map((item, i) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <span>{item.label}</span>
                    <span className="text-slate-900 font-black">{item.count}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/30">
                    <div
                      className={cn("h-full rounded-full transition-all duration-1000", item.color)}
                      style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center italic">
              Conversion rate: {funnelData.applied > 0 ? Math.round((funnelData.selected / funnelData.applied) * 100) : 0}%
            </div>
          </div>

          {/* Hall of Fame - Recent Success */}
          <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[40px] shadow-2xl shadow-indigo-200 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
            <h3 className="text-xl font-black mb-8 flex items-center gap-2 italic tracking-tight">
              <Sparkles className="text-amber-400 animate-pulse" size={20} />
              Wall of Fame
            </h3>
            <div className="space-y-6 relative z-10">
              {recentSuccess.length === 0 ? (
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center py-10">Waiting for success stories...</p>
              ) : (
                recentSuccess.map((app, i) => (
                  <div key={app.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group/item">
                    <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-black">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm truncate uppercase tracking-tight">{app.student.user.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">Placed @ {app.company.name}</p>
                    </div>
                    <Trophy className="ml-auto text-amber-400 opacity-50 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all" size={16} />
                  </div>
                ))
              )}
            </div>
            <div className="mt-8 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[9px] font-black text-amber-400 uppercase tracking-[0.2em] text-center">
              New placement streak: +{recentSuccess.length} this week
            </div>
          </div>

          <div className="lg:col-span-1 bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border border-white/40 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              Branch Performance
            </h3>
            <div className="h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-5">
                {branchData.map(b => (
                  <div key={b.name} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>{b.name}</span>
                      <span className="text-indigo-600 font-black">{b.placed} / {b.total} Placed</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000" style={{ width: `${b.total > 0 ? (b.placed / b.total) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Skill Analytics */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border border-white/40 shadow-xl shadow-slate-200/40">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              Talent Insights (Top Skills)
            </h3>
            <div className="flex flex-wrap gap-3">
              {topSkills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group/skill">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/skill:text-emerald-700">{skill.name}</span>
                  <span className="w-5 h-5 bg-white rounded-lg flex items-center justify-center text-[9px] font-black text-slate-400 group-hover/skill:text-emerald-500 border border-slate-100">{skill.count}</span>
                </div>
              ))}
              {topSkills.length === 0 && (
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic py-10 w-full text-center">No skills registered yet.</p>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border border-white/40 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              Recent Activity Log
            </h3>
            <div className="space-y-4">
              {recentApplications.length === 0 ? (
                <div className="text-center py-10 italic text-slate-400 font-bold uppercase tracking-widest text-[10px]">No activity log found.</div>
              ) : (
                recentApplications.map(app => (
                  <div key={app.id} className="flex items-center justify-between p-4 hover:bg-white/80 rounded-[28px] transition-all border border-transparent hover:border-slate-100 group/item">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover/item:scale-110 transition-transform flex-shrink-0">
                        <Users size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate leading-tight">{app.student.user.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase truncate">Applied for {app.company.role} @ {app.company.name}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">{app.status}</p>
                      <p className="text-[8px] font-black text-slate-300 mt-1 uppercase">{formatDate(app.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/dashboard/applications" className="mt-8 block text-center text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] py-4 bg-indigo-50 rounded-[24px] hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
              Open Application Manager
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Student Dashboard logic
  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: { applications: { include: { company: true } } }
  }) as any

  // Redirect to profile if not completed
  if (!student && session.user.role === "STUDENT") {
    redirect("/dashboard/profile")
  }

  // Dynamic Greeting Logic
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening"
  const subtext = [
    "Ready to take the next step in your career?",
    "Your future is being built today. Keep going!",
    "Success is where preparation meets opportunity.",
    "Don't stop until you're proud. You've got this!"
  ][Math.floor(Math.random() * 4)]

  // Profile Strength Calculation
  const profileFields = [
    student?.bio,
    student?.linkedinUrl,
    student?.githubUrl,
    student?.skills,
    student?.resumeUrl,
    student?.contact,
    student?.batchYear
  ]
  const completedFields = profileFields.filter(f => !!f).length
  const strength = Math.round((completedFields / profileFields.length) * 100)

  return (
    <div className="space-y-10 pb-10">
      {/* Header & Dynamic Greeting */}
      <div className="flex flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left items-start flex flex-col shrink-0">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-1 animate-pulse">
            <Sparkles size={14} />
            System Online • v1.2
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight font-heading leading-tight">
            {greeting}, {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              {session.user.name?.split(" ")[0]}
            </span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-md italic border-l-2 border-indigo-100 pl-4 py-1">
            &ldquo;{subtext}&rdquo;
          </p>
        </div>

        {/* Profile Strength Meter */}
        <Link href="/dashboard/profile" className="group">
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[32px] border border-white/40 shadow-xl shadow-slate-200/40 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-100">
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-100" />
                  <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * strength) / 100} className="text-indigo-600 transition-all duration-1000" />
                </svg>
                <span className="absolute text-xs font-black text-slate-900">{strength}%</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Strength</p>
                <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {strength === 100 ? "Recruitment Ready!" : "Boost your profile"}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{completedFields} of {profileFields.length} complete</span>
                </div>
              </div>
              <ArrowRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform ml-2" />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions Hub */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction icon={PenLine} label="Edit Profile" href="/dashboard/profile" theme="indigo" />
        <QuickAction icon={Search} label="Browse Jobs" href="/dashboard/companies" theme="emerald" />
        <QuickAction icon={CalendarClock} label="View Schedule" href="/dashboard/schedule" theme="amber" />
        <QuickAction icon={ExternalLink} label="Professional Identity" href="/dashboard/profile" theme="purple" />
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Applied" value={student?.applications.length || 0} icon={Briefcase} theme="blue" />
        <StatCard title="Interviews" value={student?.applications.filter((a: any) => a.status === "INTERVIEW_SCHEDULED").length || 0} icon={Trophy} theme="amber" />
        <StatCard title="Status" value={student?.applications.some((a: any) => a.status === "SELECTED") ? "Selected" : "In Progress"} icon={Users} theme="emerald" />
      </div>

      {/* Main Content Area */}
      <div className="grid gap-8 lg:grid-cols-5 items-start">
        <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border border-white/40 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
            Active Records
          </h3>
          {!student?.applications.length ? (
            <div className="text-center py-20 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200 group-hover:border-indigo-200 transition-colors">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Briefcase className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">No applications registered yet.</p>
              <Link href="/dashboard/companies" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200">
                Browse Opportunities
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {student.applications.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between border-b border-slate-100/80 pb-6 pt-2 last:border-0 last:pb-0 group/item hover:bg-white px-6 -mx-6 rounded-[32px] transition-all hover:shadow-2xl hover:shadow-slate-200/40">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover/item:border-indigo-100 transition-colors">
                      <Building2 className="text-slate-400 group-hover/item:text-indigo-600 transition-colors" size={24} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900 group-hover/item:text-indigo-600 transition-colors">{app.company.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.company.role}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-black text-emerald-600">{app.company.package}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={cn(
                      "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all glass-badge",
                      app.status === "SELECTED" && "bg-emerald-50 text-emerald-700 border border-emerald-100",
                      app.status === "REJECTED" && "bg-red-50 text-red-700 border border-red-100",
                      app.status === "APPLIED" && "bg-indigo-50 text-indigo-700 border border-indigo-100",
                      app.status === "SHORTLISTED" && "bg-blue-50 text-blue-700 border border-blue-100",
                      app.status === "INTERVIEW_SCHEDULED" && "bg-amber-50 text-amber-700 border border-amber-100",
                    )}>
                      {app.status.replace("_", " ")}
                    </span>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
                      <CalendarClock size={10} />
                      {formatDate(app.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar widgets for Student */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[40px] shadow-2xl shadow-indigo-200 text-white relative overflow-hidden group">
            <Sparkles className="absolute top-4 right-4 text-white/20 animate-pulse" size={40} />
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-3 italic">Resume Tip</h4>
              <p className="text-indigo-50/80 font-medium leading-relaxed mb-6 text-sm">
                Ensure your GitHub portfolio is pinned with your best projects before applying to tech giants.
              </p>
              <Link href="/dashboard/profile" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest backdrop-blur-md border border-white/10">
                Optimize Now <ArrowRight size={14} />
              </Link>
            </div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border border-white/40 shadow-xl shadow-slate-200/40">
            <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-1.5 h- 5 bg-emerald-500 rounded-full" />
              Skill Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {student?.skills.split(",").map((skill: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-default">
                  {skill.trim()}
                </span>
              ))}
              {!student?.skills && <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Add skills in profile</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickAction({ icon: Icon, label, href, theme }: { icon: any, label: string, href: string, theme: string }) {
  const themes: any = {
    indigo: "bg-indigo-50/80 text-indigo-600 border-indigo-100/50 hover:bg-indigo-600 hover:text-white shadow-indigo-100",
    emerald: "bg-emerald-50/80 text-emerald-600 border-emerald-100/50 hover:bg-emerald-600 hover:text-white shadow-emerald-100",
    amber: "bg-amber-50/80 text-amber-600 border-amber-100/50 hover:bg-amber-600 hover:text-white shadow-amber-100",
    purple: "bg-purple-50/80 text-purple-600 border-purple-100/50 hover:bg-purple-600 hover:text-white shadow-purple-100"
  }

  return (
    <Link href={href}>
      <div className={cn(
        "p-5 rounded-[28px] border transition-all duration-300 flex items-center gap-4 group hover:-translate-y-1 hover:shadow-xl",
        themes[theme]
      )}>
        <div className="p-2.5 rounded-2xl bg-white/50 backdrop-blur-sm group-hover:bg-white/20 group-hover:scale-110 transition-all">
          <Icon size={20} />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
      </div>
    </Link>
  )
}

function StatCard({ title, value, icon: Icon, theme = "blue" }: { title: string, value: number | string, icon: any, theme?: "blue" | "purple" | "emerald" | "amber" }) {
  const themes = {
    blue: {
      bg: "bg-blue-50/50",
      iconContainer: "bg-gradient-to-br from-blue-500 to-blue-600",
      text: "text-blue-600",
      shadow: "hover:shadow-blue-200/50",
      icon: "text-white"
    },
    purple: {
      bg: "bg-purple-50/50",
      iconContainer: "bg-gradient-to-br from-purple-500 to-purple-600",
      text: "text-purple-600",
      shadow: "hover:shadow-purple-200/50",
      icon: "text-white"
    },
    emerald: {
      bg: "bg-emerald-50/50",
      iconContainer: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      text: "text-emerald-600",
      shadow: "hover:shadow-emerald-200/50",
      icon: "text-white"
    },
    amber: {
      bg: "bg-amber-50/50",
      iconContainer: "bg-gradient-to-br from-amber-500 to-amber-600",
      text: "text-amber-600",
      shadow: "hover:shadow-amber-200/50",
      icon: "text-white"
    }
  }

  const currentTheme = themes[theme]

  return (
    <div className={cn(
      "p-6 rounded-[32px] border border-white/40 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition-all duration-300 flex items-center gap-5 group hover:-translate-y-2 relative overflow-hidden",
      "bg-white/70",
      currentTheme.shadow
    )}>
      {/* Dynamic Background Glow */}
      <div className={cn("absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-[40px] opacity-20 transition-opacity group-hover:opacity-40", currentTheme.text.replace("text", "bg"))} />

      <div className={cn("p-4 rounded-3xl shadow-lg transition-transform duration-500 group-hover:rotate-6", currentTheme.iconContainer)}>
        <Icon className={cn("h-7 w-7", currentTheme.icon)} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  )
}
