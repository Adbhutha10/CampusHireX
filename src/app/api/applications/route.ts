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

import { ApplicationSchema } from "@/shared/validation"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const { companyId } = ApplicationSchema.parse(body)

    // Identify student from session
    const student = await prisma.studentProfile.findUnique({ 
      where: { userId: session.user.id } 
    })
    
    const company = await prisma.company.findUnique({ where: { id: companyId } })

    if (!student || !company) return new NextResponse("Not Found", { status: 404 })

    // 1. Check if application already exists
    const existingApplication = await prisma.application.findUnique({
      where: {
        studentId_companyId: {
          studentId: student.id,
          companyId: companyId
        }
      }
    })

    if (existingApplication) {
      return new NextResponse("Already Applied", { status: 409 })
    }

    // 2. Check if deadline has passed
    if (new Date() > new Date(company.deadline)) {
      return new NextResponse("Deadline Passed", { status: 403 })
    }

    if (student.cgpa < company.criteria) {
      return new NextResponse("Not Eligible", { status: 403 })
    }

    const application = await prisma.application.create({
      data: {
        companyId,
        studentId: student.id,
        status: "APPLIED"
      }
    })

    // Fetch student email for Resend
    const studentUser = await prisma.user.findUnique({
      where: { id: student.userId },
      select: { email: true, name: true }
    })

    // Create Notification
    await createNotification(
      student.userId,
      "Application Submitted",
      `You have successfully applied to ${company.name} for the ${company.role} position.`,
      "job",
      studentUser?.email ? {
        studentName: studentUser.name || "Student",
        companyName: company.name,
        status: "APPLIED",
        email: studentUser.email
      } : undefined
    )

    return NextResponse.json(application)
  } catch (err: any) {
    if (err.name === "ZodError") {
      return new NextResponse(err.errors[0].message, { status: 400 })
    }
    console.error(err)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
