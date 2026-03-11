import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/notifications"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })

  try {
    const data = await req.json()
    const { status } = data

    const application = await prisma.application.update({
      where: { id: params.id },
      data: { status },
      include: { student: true, company: true }
    })

    // Create notification for the student
    let message = ""
    switch(status) {
      case "SHORTLISTED":
        message = `Congratulations! You have been shortlisted for ${application.company.name}. Check your schedule for interview details.`
        break
      case "SELECTED":
        message = `Amazing news! You have been selected by ${application.company.name}. The placement office will contact you soon.`
        break
      case "REJECTED":
        message = `Update for ${application.company.name}: Your application will not be proceeding at this time.`
        break
      default:
        message = `The status of your application for ${application.company.name} has been updated to ${status.replace("_", " ")}.`
    }

    await createNotification(
      application.student.userId,
      "Application Status Updated",
      message,
      status === "SELECTED" ? "result" : "system"
    )

    return NextResponse.json(application)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
