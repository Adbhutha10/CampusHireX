export const dynamic = "force-dynamic"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import ProfileForm from "@/app/dashboard/profile/ProfileForm"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id }
  })

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Student Profile</h1>
        <p className="text-muted-foreground">Keep your professional information up to date.</p>
      </div>

      <div className="card p-8 shadow-sm">
        <ProfileForm initialData={student} />
      </div>
    </div>
  )
}
