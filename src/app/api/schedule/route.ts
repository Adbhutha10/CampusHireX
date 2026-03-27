export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { NextResponse } from "next/server"

import { createNotification } from "@/backend/lib/notifications"

import { InterviewScheduleSchema } from "@/shared/validation"

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const { applicationId, dateTime, location } = InterviewScheduleSchema.parse(body)

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { student: true, company: true }
    })

    if (!application) return new NextResponse("Not Found", { status: 404 })

    const schedule = await prisma.interviewSchedule.create({
      data: {
        applicationId,
        companyId: application.companyId,
        dateTime: new Date(dateTime),
        location,
      }
    })

    // Update application status automatically to INTERVIEW_SCHEDULED
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "INTERVIEW_SCHEDULED" }
    })

    // Create Notification
    // Fetch student's user email for Resend
    const studentUser = await prisma.user.findUnique({
      where: { id: application.student.userId },
      select: { email: true, name: true }
    })

    await createNotification(
      application.student.userId,
      "Interview Scheduled",
      `Your interview for ${application.company.name} has been scheduled for ${new Date(dateTime).toLocaleString()} at ${location}.`,
      "schedule",
      studentUser?.email ? {
        studentName: studentUser.name || "Student",
        companyName: application.company.name,
        status: "INTERVIEW_SCHEDULED",
        email: studentUser.email
      } : undefined
    )

    return NextResponse.json(schedule)
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "ZodError") {
        // @ts-ignore
        return new NextResponse(err.errors[0].message, { status: 400 })
      }
      return new NextResponse(err.message, { status: 500 })
    }
    return new NextResponse("Internal Error", { status: 500 })
  }
}
