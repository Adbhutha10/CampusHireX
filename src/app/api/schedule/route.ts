export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { NextResponse } from "next/server"

import { createNotification } from "@/backend/lib/notifications"

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })

  try {
    const data = await req.json()
    const { applicationId, dateTime, location } = data

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
    await createNotification(
      application.student.userId,
      "Interview Scheduled",
      `Your interview for ${application.company.name} has been scheduled for ${new Date(dateTime).toLocaleString()} at ${location}.`,
      "schedule"
    )

    return NextResponse.json(schedule)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
