import { prisma } from "./prisma"

export async function createNotification(userId: string, title: string, message: string, type: string) {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type
    }
  })
}
