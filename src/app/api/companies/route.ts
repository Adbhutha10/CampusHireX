export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" }
  })
  return NextResponse.json(companies)
}

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })

  try {
    const data = await req.json()
    const { name, role, package: pkg, criteria, description, deadline, requiredSkills } = data

    if (!name || !role || !pkg || !criteria || !description || !deadline) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const company = await (prisma.company as any).create({
      data: {
        name,
        role,
        package: pkg,
        criteria: parseFloat(criteria) || 0,
        requiredSkills: requiredSkills || "",
        description,
        deadline: new Date(deadline),
      }
    })
    return NextResponse.json(company)
  } catch (err: any) {
    return new NextResponse(err.message || "Internal Error", { status: 500 })
  }
}
