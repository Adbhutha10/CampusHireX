import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { redirect } from "next/navigation"
import AnalyticsDashboard from "@/app/dashboard/analytics/AnalyticsDashboard"

export default async function AnalyticsPage() {
  const session = await auth()
  if (session?.user.role !== "ADMIN") redirect("/dashboard")

  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } })
  const totalPlaced = await prisma.application.count({ where: { status: "SELECTED" } })
  const totalCompanies = await prisma.company.count()

  const students = await prisma.studentProfile.findMany({
    select: { branch: true, userId: true }
  })
  
  const placedApplications = await prisma.application.findMany({
    where: { status: "SELECTED" },
    include: { student: true }
  })

  // Group by branch
  const branchDataMap: Record<string, { name: string, total: number, placed: number }> = {}
  
  students.forEach((s) => {
    if (!branchDataMap[s.branch]) branchDataMap[s.branch] = { name: s.branch, total: 0, placed: 0 }
    branchDataMap[s.branch].total++
  })

  placedApplications.forEach((app) => {
    if (branchDataMap[app.student.branch]) {
      branchDataMap[app.student.branch].placed++
    }
  })

  const branchData = Object.values(branchDataMap)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Placement Analytics</h1>
        <p className="text-muted-foreground">Detailed insights into campus recruitment performance.</p>
      </div>

      <AnalyticsDashboard 
        stats={{ totalStudents, totalPlaced, totalCompanies }}
        branchData={branchData}
      />
    </div>
  )
}
