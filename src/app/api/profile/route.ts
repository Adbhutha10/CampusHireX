export const dynamic = "force-dynamic"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const data = await req.json()
    const { rollNumber, branch, cgpa, skills, resumeUrl, contact } = data

    const profile = await prisma.studentProfile.upsert({
      where: { userId: session.user.id },
      update: {
        rollNumber,
        branch,
        cgpa: parseFloat(cgpa),
        skills,
        resumeUrl,
        contact,
      },
      create: {
        userId: session.user.id,
        rollNumber,
        branch,
        cgpa: parseFloat(cgpa),
        skills,
        resumeUrl,
        contact,
      },
    })
    return NextResponse.json(profile)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
