import { auth } from "@/auth"
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
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <Sidebar role={session.user.role} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
