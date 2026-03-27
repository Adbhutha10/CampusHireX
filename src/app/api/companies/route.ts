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

import { CompanySchema } from "@/shared/validation"

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const { name, role, package: pkg, criteria, description, deadline, requiredSkills } = CompanySchema.parse(body)

    const company = await (prisma.company as any).create({
      data: {
        name,
        role,
        package: pkg,
        criteria,
        requiredSkills,
        description,
        deadline,
      }
    })
    return NextResponse.json(company)
  } catch (err: any) {
    if (err.name === "ZodError") {
      return new NextResponse(err.errors[0].message, { status: 400 })
    }
    return new NextResponse(err.message || "Internal Error", { status: 500 })
  }
}
