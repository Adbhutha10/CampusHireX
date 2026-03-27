"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, X, Loader2 } from "lucide-react"
import { cn } from "@/backend/lib/utils"
import ExportButton from "./ExportButton"

interface Student {
  id: string
  rollNumber: string
  branch: string
  cgpa: number
  user: {
    name: string | null
    email: string | null
  }
  _count: {
    applications: number
  }
}

interface StudentSearchAndFilterProps {
  students: Student[]
  branches: string[]
}

export default function StudentSearchAndFilter({ students, branches }: StudentSearchAndFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [selectedBranch, setSelectedBranch] = useState(searchParams.get("branch") || "All")
  const [minCgpa, setMinCgpa] = useState(searchParams.get("minCgpa") || "")

  // Debounced update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchTerm) params.set("search", searchTerm)
      else params.delete("search")
      
      if (selectedBranch !== "All") params.set("branch", selectedBranch)
      else params.delete("branch")
      
      if (minCgpa) params.set("minCgpa", minCgpa)
      else params.delete("minCgpa")

      startTransition(() => {
        router.push(`?${params.toString()}`)
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, selectedBranch, minCgpa, router, searchParams])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1 w-full md:max-w-md relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by name or roll number..."
            className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-md border border-slate-200 rounded-[20px] outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isPending && <Loader2 className="animate-spin text-indigo-500" size={18} />}
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
            <Filter size={16} className="text-slate-400" />
            <select 
              className="bg-transparent outline-none text-xs font-black uppercase tracking-widest text-slate-600 cursor-pointer"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Min CGPA</span>
            <input 
              type="number" 
              step="0.1"
              min="0"
              max="10"
              placeholder="0.0"
              className="bg-transparent outline-none text-xs font-black text-indigo-600 w-12 text-center"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
            />
          </div>

          <ExportButton data={students} />
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/40 border border-white/40 min-h-[400px]">
        {/* Same table structure as before, using 'students' prop directly */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Info</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Records</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center text-slate-400 font-bold uppercase tracking-widest italic text-xs">
                    No matching student records found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-white/95 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-white rounded-2xl flex items-center justify-center border border-indigo-100/50 shadow-sm text-indigo-600 font-black text-lg group-hover:scale-110 transition-transform">
                          {student.user.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg leading-tight">{student.user.name || "Unnamed Student"}</p>
                          <p className="text-xs text-slate-400 font-medium mt-1">{student.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">{student.branch}</span>
                          <span className="text-xs font-mono font-bold text-slate-700">{student.rollNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                           <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${student.cgpa * 10}%` }} />
                           </div>
                           <span className="text-[10px] font-black text-slate-400">CGPA: {student.cgpa}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                        student._count.applications > 0 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-slate-50 text-slate-400 border-slate-100"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", student._count.applications > 0 ? "bg-emerald-500" : "bg-slate-300")} />
                        {student._count.applications > 0 ? "In Process" : "Not Started"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <p className="text-xl font-black text-slate-900 leading-none">{student._count.applications}</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Applications</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
