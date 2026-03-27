import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const data = await req.json()
    const { notificationId } = data

    if (notificationId) {
      // Mark specific notification as read
      await prisma.notification.update({
        where: { 
          id: notificationId,
          userId: session.user.id // Ensure user owns the notification
        },
        data: { isRead: true }
      })
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true }
      })
    }

    return new NextResponse("Success", { status: 200 })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
