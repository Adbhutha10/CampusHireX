"use client"

import { useState, useMemo } from "react"
import { Calendar, DollarSign, Award, Clock, ArrowRight, Target, CheckCircle2, XCircle } from "lucide-react"
import { cn, formatDate } from "@/backend/lib/utils"
import { useRouter } from "next/navigation"
import { calculateMatchScore } from "@/backend/lib/matching"

interface CompanyListProps {
  companies: any[]
  role: string
  studentCgpa: number
  studentSkills: string
  studentId: string
}

export default function CompanyList({ companies, role, studentCgpa, studentSkills, studentId }: CompanyListProps) {
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const router = useRouter()

  const sortedCompanies = useMemo(() => {
    if (role !== "STUDENT") return companies
    
    return [...companies].map(company => {
      const match = calculateMatchScore(
        studentSkills,
        studentCgpa,
        company.requiredSkills,
        company.criteria
      )
      return { ...company, match }
    }).sort((a, b) => b.match.score - a.match.score)
  }, [companies, role, studentCgpa, studentSkills])

  async function handleApply(companyId: string) {
    setApplyingId(companyId)
    const res = await fetch("/api/applications", {
      method: "POST",
      body: JSON.stringify({ companyId, studentId }),
      headers: { "Content-Type": "application/json" }
    })

    if (res.ok) {
      router.refresh()
    } else {
      alert("Failed to apply. Check eligibility.")
    }
    setApplyingId(null)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {sortedCompanies.length === 0 && (
        <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium text-lg">No companies registered yet.</p>
        </div>
      )}
      {sortedCompanies.map((company) => {
        const isEligible = studentCgpa >= company.criteria || role === "ADMIN"
        const hasApplied = company.applications && company.applications.length > 0
        const isPastDeadline = new Date(company.deadline) < new Date()
        const match = company.match

        return (
          <div key={company.id} className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition-all shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100/50 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:bg-indigo-50" />

            <div className="space-y-4 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{company.name}</h3>
                  <p className="text-indigo-600 font-black text-[11px] uppercase tracking-widest">{company.role}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full text-[11px] font-black text-emerald-700 border border-emerald-100 shadow-sm">
                     <DollarSign size={14} />
                     {company.package}
                   </div>
                   {role === "STUDENT" && match && (
                      <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black border shadow-sm",
                        match.score >= 80 ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                        match.score >= 50 ? "bg-amber-50 text-amber-700 border-amber-100" :
                        "bg-slate-50 text-slate-700 border-slate-100"
                      )}>
                        <Target size={14} />
                        {match.score}% Match
                      </div>
                   )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[13px] font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-indigo-400" />
                  <span>Min. {company.criteria} CGPA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-indigo-400" />
                  <span>Ends {formatDate(company.deadline)}</span>
                </div>
              </div>

              {role === "STUDENT" && match && company.requiredSkills && (
                <div className="space-y-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skill Analysis</p>
                  <div className="flex flex-wrap gap-2">
                    {match.matchedSkills.map((s: string) => (
                      <span key={s} className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50/50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 size={10} /> {s}
                      </span>
                    ))}
                    {match.missingSkills.map((s: string) => (
                      <span key={s} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100/50 px-2 py-0.5 rounded-md">
                        <XCircle size={10} /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm line-clamp-2 text-slate-500 leading-relaxed">
                {company.description}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50">
              {role === "STUDENT" ? (
                <>
                  {!isEligible ? (
                    <span className="text-[11px] font-black text-red-700 uppercase tracking-widest flex items-center gap-1 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full shadow-sm">
                      Ineligible ({studentCgpa})
                    </span>
                  ) : hasApplied ? (
                    <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shadow-sm">
                      Already Applied
                    </span>
                  ) : isPastDeadline ? (
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                      Deadline Passed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(company.id)}
                      disabled={applyingId === company.id}
                      className="btn btn-primary px-6 h-10 text-sm font-bold shadow hover:shadow-primary/20 flex items-center gap-2 transition-transform active:scale-95"
                    >
                      {applyingId === company.id ? "Applying..." : "Apply Now"}
                      <ArrowRight size={16} />
                    </button>
                  )
                  }
                </>
              ) : (
                <div className="flex gap-2">
                   <a href={`/dashboard/companies/${company.id}/edit`} className="text-xs font-bold text-primary hover:underline">Edit Details</a>
                   <span className="text-muted-foreground">•</span>
                   <a href={`/dashboard/companies/${company.id}/applicants`} className="text-xs font-bold text-primary hover:underline">View Applicants</a>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
