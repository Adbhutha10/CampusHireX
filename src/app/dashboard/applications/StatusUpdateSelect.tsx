"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export function StatusUpdateSelect({ applicationId, currentStatus }: { applicationId: string, currentStatus: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const router = useRouter()

  const statuses = ["APPLIED", "SHORTLISTED", "INTERVIEW_SCHEDULED", "SELECTED", "REJECTED"]

  const updateStatus = async (newStatus: string) => {
    const oldStatus = status
    // Optimistic Update
    setStatus(newStatus)
    setIsLoading(true)

    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" }
      })

      if (!res.ok) throw new Error("Failed to update status")
      
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`)
      router.refresh()
    } catch (_err) {
      // Rollback
      setStatus(oldStatus)
      toast.error("Failed to update status")
    } finally {
      setIsLoading(false)
    }
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
