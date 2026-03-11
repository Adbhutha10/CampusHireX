"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function StatusUpdateSelect({ applicationId, currentStatus }: { applicationId: string, currentStatus: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const router = useRouter()

  const statuses = ["APPLIED", "SHORTLISTED", "INTERVIEW_SCHEDULED", "SELECTED", "REJECTED"]

  const updateStatus = async (newStatus: string) => {
    setIsLoading(true)
    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
      headers: { "Content-Type": "application/json" }
    })

    if (res.ok) {
      setStatus(newStatus)
      router.refresh()
    } else {
      alert("Failed to update status")
    }
    setIsLoading(false)
  }

  return (
    <select 
      value={status} 
      onChange={(e) => updateStatus(e.target.value)}
      disabled={isLoading}
      className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
    >
      {statuses.map(s => (
        <option key={s} value={s}>{s.replace("_", " ")}</option>
      ))}
    </select>
  )
}
