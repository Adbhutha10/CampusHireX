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

    const company = await prisma.company.create({
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "ZodError") {
        // @ts-expect-error - ZodError structure
        return new NextResponse(err.errors[0].message, { status: 400 })
      }
      return new NextResponse(err.message, { status: 500 })
    }
    return new NextResponse("Internal Error", { status: 500 })
  }
}
