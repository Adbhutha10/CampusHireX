export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (session?.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })

  const applications = await prisma.application.findMany({
    include: {
      student: { include: { user: true } },
      company: true
    },
    orderBy: { updatedAt: "desc" }
  })
  return NextResponse.json(applications)
}

import { createNotification } from "@/backend/lib/notifications"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const data = await req.json()
    const { companyId, studentId } = data

    // Verify eligibility
    const student = await prisma.studentProfile.findUnique({ where: { id: studentId } })
    const company = await prisma.company.findUnique({ where: { id: companyId } })

    if (!student || !company) return new NextResponse("Not Found", { status: 404 })

    if (student.cgpa < company.criteria) {
      return new NextResponse("Not Eligible", { status: 403 })
    }

    const application = await prisma.application.create({
      data: {
        companyId,
        studentId,
        status: "APPLIED"
      }
    })

    // Create Notification
    await createNotification(
      student.userId,
      "Application Submitted",
      `You have successfully applied to ${company.name} for the ${company.role} position.`,
      "job"
    )

    return NextResponse.json(application)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
