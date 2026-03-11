export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { redirect } from "next/navigation"

export default async function ResultsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const selectedStudents = await prisma.application.findMany({
    where: { status: "SELECTED" },
    include: {
      company: true,
      student: { include: { user: true } }
    },
    orderBy: { updatedAt: "desc" }
  })

  return (
    <div className="space-y-8">
      <div className="text-center sm:text-left">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Placement Hall of Fame</h1>
        <p className="text-muted-foreground text-lg">Celebrating the milestones of our students and the partners who chose them.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {selectedStudents.length === 0 && (
          <div className="col-span-full py-24 text-center card bg-accent/5 border-dashed border-2 flex flex-col items-center gap-4">
            <div className="p-5 bg-white rounded-full shadow-sm text-muted-foreground/30">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
            <p className="text-xl font-bold text-muted-foreground">Results are yet to be announced.</p>
            <p className="text-sm text-muted-foreground/60 max-w-xs">Check back soon as recruitment processes conclude across various departments.</p>
          </div>
        )}
        {selectedStudents.map((app: any) => (
          <div key={app.id} className="card p-8 border-t-8 border-t-green-500 shadow-lg hover:-translate-y-2 transition-all group bg-gradient-to-br from-card to-white">
            <div className="flex flex-col items-center text-center space-y-6">
               <div className="relative">
                 <div className="p-5 bg-green-50 rounded-3xl group-hover:bg-green-100 transition-colors shadow-inner">
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                 </div>
                 <div className="absolute -top-2 -right-2 bg-amber-400 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">TOP TIER</div>
               </div>
               
               <div className="space-y-1">
                 <h3 className="text-2xl font-black text-foreground tracking-tight">{app.student.user.name}</h3>
                 <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{app.student.branch} • {app.student.rollNumber}</p>
               </div>
               
               <div className="w-full pt-6 border-t border-slate-100 flex flex-col gap-1 items-center">
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Hired by</span>
                 <p className="text-2xl font-black text-primary tracking-tight">{app.company.name}</p>
                 <p className="text-sm font-bold text-slate-500">{app.company.role}</p>
               </div>
               
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-md shadow-green-200">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                 Success
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
