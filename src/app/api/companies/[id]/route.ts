import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (session?.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })

  try {
    const data = await req.json()
    const { name, role, package: pkg, criteria, description, deadline } = data

    const company = await prisma.company.update({
      where: { id },
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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const company = await prisma.company.findUnique({
      where: { id }
    })
    if (!company) return new NextResponse("Not Found", { status: 404 })
    return NextResponse.json(company)
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
