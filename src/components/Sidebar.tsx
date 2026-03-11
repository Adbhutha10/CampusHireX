"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Calendar, 
  Trophy, 
  UserCircle, 
  Bell, 
  Briefcase,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Zap
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

interface SidebarProps {
  role: string
}

export default function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const adminLinks = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Students", icon: Users, href: "/dashboard/students" },
    { label: "Companies", icon: Building2, href: "/dashboard/companies" },
    { label: "Applications", icon: Briefcase, href: "/dashboard/applications" },
    { label: "Schedule", icon: Calendar, href: "/dashboard/schedule" },
    { label: "Results", icon: Trophy, href: "/dashboard/results" },
    { label: "Analytics", icon: Trophy, href: "/dashboard/analytics" },
  ]

  const studentLinks = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Companies", icon: Building2, href: "/dashboard/companies" },
    { label: "My Applications", icon: ClipboardList, href: "/dashboard/applications" },
    { label: "Schedule", icon: Calendar, href: "/dashboard/schedule" },
    { label: "My Profile", icon: UserCircle, href: "/dashboard/profile" },
    { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  ]

  const links = role === "ADMIN" ? adminLinks : studentLinks

  return (
    <aside className={cn(
      "flex h-screen flex-col border-r bg-card transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        {!isCollapsed && (
          <Link className="flex items-center gap-3 group" href="/dashboard">
             <Image 
                src="/logo without text.png" 
                alt="CampusHireX Icon" 
                width={32} 
                height={32} 
                className="object-contain w-8 h-8 rounded-lg shadow-sm" 
             />
             <span className="text-xl font-extrabold tracking-tight text-slate-900">
               Campus<span className="text-indigo-600">HireX</span>
             </span>
          </Link>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-md p-1.5 hover:bg-accent focus:outline-none"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all font-semibold",
              pathname === link.href 
                 ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                 : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              isCollapsed && "justify-center px-0"
            )}
            title={isCollapsed ? link.label : ""}
          >
            <link.icon size={22} />
            {!isCollapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-destructive transition-all hover:bg-destructive/10",
            isCollapsed && "justify-center px-0"
          )}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={22} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
