export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { redirect } from "next/navigation"
import StudentSearchAndFilter from "./StudentSearchAndFilter"

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; branch?: string; minCgpa?: string }>
}) {
  const session = await auth()
  const params = await searchParams
  if (session?.user.role !== "ADMIN") redirect("/dashboard")

  const where: any = {}
  if (params.search) {
    where.OR = [
      { user: { name: { contains: params.search, mode: "insensitive" } } },
      { rollNumber: { contains: params.search, mode: "insensitive" } },
    ]
  }
  if (params.branch && params.branch !== "All") {
    where.branch = params.branch
  }
  if (params.minCgpa) {
    where.cgpa = { gte: parseFloat(params.minCgpa) }
  }

  const students = await prisma.studentProfile.findMany({
    where,
    include: {
      user: true,
      _count: { select: { applications: true } }
    }
  })

  // Get unique branches for the filter component
  const allBranches = await prisma.studentProfile.findMany({
    select: { branch: true },
    distinct: ["branch"],
  })
  const branches = ["All", ...allBranches.map((b) => b.branch)]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">Student Directory</h1>
          <p className="text-slate-500 font-medium text-lg mt-2">Comprehensive overview of all registered students and their placement readiness.</p>
        </div>
      </div>

      <StudentSearchAndFilter students={students as any} branches={branches} />
    </div>
  )
}
