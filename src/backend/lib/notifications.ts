import { prisma } from "./prisma"
import { resend, SENDER_EMAIL } from "./resend"
import { StatusUpdateEmail } from "@/frontend/components/emails/StatusUpdateEmail"
import * as React from "react"

export async function createNotification(
  userId: string, 
  title: string, 
  message: string, 
  type: string,
  emailData?: {
    studentName: string,
    companyName: string,
    status: string,
    email: string
  }
) {
  // Create database notification
  const notification = await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type
    }
  })

  // If email data is provided, send email via Resend
  if (emailData && process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: `CampusHireX <${SENDER_EMAIL}>`,
        to: emailData.email,
        subject: `Update on your application for ${emailData.companyName}`,
        react: React.createElement(StatusUpdateEmail, {
          studentName: emailData.studentName,
          companyName: emailData.companyName,
          status: emailData.status,
          actionUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`
        })
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  return notification;
}
