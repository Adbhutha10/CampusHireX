export const dynamic = "force-dynamic"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ExportButton from "./ExportButton"

export default async function StudentsPage() {
  const session = await auth()
  if (session?.user.role !== "ADMIN") redirect("/dashboard")

  const students = await prisma.studentProfile.findMany({
    include: {
      user: true,
      _count: { select: { applications: true } }
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">Student Directory</h1>
          <p className="text-slate-500 font-medium text-lg mt-2">Comprehensive overview of all registered students and their placement readiness.</p>
        </div>
        <ExportButton data={students} />
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Name</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact / Roll</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Branch</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">CGPA</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic bg-accent/5">
                    No students have completed their profiles yet.
                  </td>
                </tr>
              )}
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg">{student.user.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{student.user.email}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-mono text-sm font-bold text-slate-700">{student.rollNumber}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{student.contact}</p>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-600 tracking-tight">{student.branch}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-block px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg font-black text-[11px] uppercase tracking-widest">{student.cgpa}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-block px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg font-black text-[11px]">{student._count.applications} apps</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
