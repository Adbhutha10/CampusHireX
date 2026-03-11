import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function NotificationsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Notification Center</h1>
        <p className="text-muted-foreground text-lg mt-2">Personalized updates and important placement announcements.</p>
      </div>

      <div className="space-y-6">
        {notifications.length === 0 && (
          <div className="card p-20 text-center bg-accent/10 border-dashed">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">No notifications yet. Keep applying!</p>
          </div>
        )}
        {notifications.map((n: any) => (
          <NotificationItem 
            key={n.id}
            title={n.title} 
            message={n.message}
            time={new Date(n.createdAt).toLocaleString()}
            isNew={!n.isRead}
            type={n.type}
          />
        ))}
      </div>
    </div>
  )
}

function NotificationItem({ title, message, time, isNew, type }: { title: string, message: string, time: string, isNew: boolean, type: string }) {
  const icons: Record<string, any> = {
    schedule: <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>,
    job: <div className="p-3 bg-green-500/10 text-green-600 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>,
    result: <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></div>,
    system: <div className="p-3 bg-slate-500/10 text-slate-600 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.72V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.17a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/></svg></div>,
  }

  return (
    <div className={cn(
      "card p-6 border-l-8 transition-all hover:translate-x-1 shadow-sm hover:shadow-md cursor-pointer group",
      isNew ? "border-l-primary bg-primary/[0.02]" : "border-l-slate-200"
    )}>
      <div className="flex items-start gap-6">
        <div className="shrink-0 transition-transform group-hover:scale-110 duration-300">
          {icons[type]}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">{title}</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 bg-secondary/50 px-2 py-1 rounded-md">{time}</span>
          </div>
          <p className="text-muted-foreground font-medium leading-relaxed max-w-[90%]">{message}</p>
        </div>
        {isNew && (
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse self-center shadow-lg shadow-primary/50" />
        )}
      </div>
    </div>
  )
}
