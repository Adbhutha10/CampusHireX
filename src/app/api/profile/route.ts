export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const data = await req.json()
    const { 
      rollNumber, branch, cgpa, skills, resumeUrl, contact,
      year, gender, linkedinUrl, githubUrl, bio, batchYear 
    } = data

    const profile = await (prisma.studentProfile as any).upsert({
      where: { userId: session.user.id },
      update: {
        rollNumber,
        branch,
        cgpa: parseFloat(cgpa),
        year: parseInt(year) || 1,
        gender,
        linkedinUrl,
        githubUrl,
        bio,
        batchYear,
        skills,
        resumeUrl,
        contact,
      },
      create: {
        userId: session.user.id,
        rollNumber,
        branch,
        cgpa: parseFloat(cgpa),
        year: parseInt(year) || 1,
        gender,
        linkedinUrl,
        githubUrl,
        bio,
        batchYear,
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
