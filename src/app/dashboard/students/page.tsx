export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { redirect } from "next/navigation"
import StudentSearchAndFilter from "./StudentSearchAndFilter"

export default async function StudentsPage() {
  const session = await auth()
  if (session?.user.role !== "ADMIN") redirect("/dashboard")

  const students = await prisma.studentProfile.findMany({
    include: {
      user: true,
      _count: { select: { applications: true } }
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">Student Directory</h1>
          <p className="text-slate-500 font-medium text-lg mt-2">Comprehensive overview of all registered students and their placement readiness.</p>
        </div>
      </div>

      <StudentSearchAndFilter students={students as any} />
    </div>
  )
}
