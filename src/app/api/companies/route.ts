export const dynamic = "force-dynamic"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
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
    const { name, role, package: pkg, criteria, description, deadline } = data

    const company = await prisma.company.create({
      data: {
        name,
        role,
        package: pkg,
        criteria: parseFloat(criteria),
        description,
        deadline: new Date(deadline),
      }
    })
    return NextResponse.json(company)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
