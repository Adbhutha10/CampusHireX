export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { redirect } from "next/navigation"
import { formatDate, formatTime } from "@/backend/lib/utils"

export default async function SchedulePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const schedules = await prisma.interviewSchedule.findMany({
    where: session.user.role === "STUDENT" 
      ? { application: { student: { userId: session.user.id } } }
      : {},
    include: {
      company: true,
      application: { include: { student: { include: { user: true } } } }
    },
    orderBy: { dateTime: "asc" }
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Sessions</h1>
          <p className="text-muted-foreground">Keep track of upcoming technical and HR rounds.</p>
        </div>
        {session.user.role === "ADMIN" && (
           <a href="/dashboard/schedule/new" className="btn btn-primary px-8 py-3 shadow-lg hover:shadow-primary/30 active:scale-95 transition-all">
             Schedule New Slot
           </a>
        )}
      </div>

      <div className="grid gap-6">
        {schedules.length === 0 && (
          <div className="card p-16 text-center italic text-muted-foreground bg-accent/5 border-dashed border-2">
            <div className="mb-2 opacity-50 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-off"><path d="M16 2v4"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="m21 21-9.5-9.5"/><path d="M9.8 4H16c1.1 0 2 .9 2 2v5.1"/><path d="M4 8.5V6a2 2 0 0 1 2-2h1.8"/><path d="M3 15.5V18c0 1.1.9 2 2 2h10.5"/><path d="m2 2 20 20"/></svg>
            </div>
            <p className="text-lg font-medium">No interviews scheduled yet.</p>
          </div>
        )}
        {schedules.map((slot: any) => (
          <div key={slot.id} className="card p-8 border-l-8 border-l-primary hover:shadow-xl transition-all group">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Candidate Selection Process</span>
                <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{slot.company.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-secondary text-foreground text-xs font-bold rounded-full uppercase tracking-widest">{slot.company.role}</span>
                  {session.user.role === "ADMIN" && (
                    <span className="text-sm font-medium text-muted-foreground italic">for {slot.application.student.user.name}</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row lg:flex-col lg:items-end justify-center gap-4">
                <div className="px-6 py-4 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 flex flex-col items-center sm:items-start lg:items-end">
                  <span className="text-2xl font-black">{formatTime(slot.dateTime)}</span>
                  <span className="text-xs font-bold opacity-80 uppercase tracking-widest">{formatDate(slot.dateTime, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground bg-accent/30 px-4 py-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  {slot.location}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
