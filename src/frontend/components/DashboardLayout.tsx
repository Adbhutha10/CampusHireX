import { auth } from "@/backend/auth"
import Sidebar from "./Sidebar"
import { redirect } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-200/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none -z-10" />

      <Sidebar role={session.user.role} name={session.user.name || ""} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 relative z-10">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
