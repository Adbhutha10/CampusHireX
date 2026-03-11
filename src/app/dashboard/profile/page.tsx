export const dynamic = "force-dynamic"
import { auth } from "@/backend/auth"
import { prisma } from "@/backend/lib/prisma"
import ProfileForm from "@/app/dashboard/profile/ProfileForm"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id }
  })

  return (
    <div className="max-w-4xl mx-auto space-y-10 relative">
      {/* Decorative background for the profile */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
          Student Profile
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-3 bg-white/50 w-fit px-3 py-1 rounded-full backdrop-blur-sm border border-slate-100">
          Complete your professional identity to stand out to recruiters.
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white/40 relative z-10 overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full -mr-16 -mt-16 blur-2xl" />
        <ProfileForm initialData={student} />
      </div>
    </div>
  )
}
