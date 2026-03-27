export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { NextResponse } from "next/server"

import { StudentProfileSchema } from "@/shared/validation"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const validatedData = StudentProfileSchema.parse(body)
    
    const { 
      rollNumber, branch, cgpa, skills, resumeUrl, contact,
      year, gender, linkedinUrl, githubUrl, bio, batchYear 
    } = validatedData

    const profile = await prisma.studentProfile.upsert({
      where: { userId: session.user.id },
      update: {
        rollNumber,
        branch,
        cgpa,
        year,
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
        cgpa,
        year,
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "ZodError") {
        // @ts-expect-error
        return new NextResponse(err.errors[0].message, { status: 400 })
      }
      return new NextResponse(err.message, { status: 500 })
    }
    return new NextResponse("Internal Error", { status: 500 })
  }
}
