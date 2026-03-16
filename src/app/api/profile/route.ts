export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const data = await req.json()
    console.log("Profile update request received:", data);
    
    const { 
      rollNumber, branch, cgpa, skills, resumeUrl, contact,
      year, gender, linkedinUrl, githubUrl, bio, batchYear 
    } = data

    // Robust parsing
    const parsedCgpa = parseFloat(cgpa) || 0;
    const parsedYear = parseInt(year) || 1;

    console.log("Parsed numbers:", { parsedCgpa, parsedYear });

    const profile = await prisma.studentProfile.upsert({
      where: { userId: session.user.id },
      update: {
        rollNumber,
        branch,
        cgpa: parsedCgpa,
        year: parsedYear,
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
        cgpa: parsedCgpa,
        year: parsedYear,
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
    console.log("Profile updated successfully:", profile.id);
    return NextResponse.json(profile)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
