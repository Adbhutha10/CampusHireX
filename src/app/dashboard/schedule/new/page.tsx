"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NewSchedulePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [applications, setApplications] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("/api/applications")
      .then(res => res.json())
      .then(data => setApplications(data))
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const res = await fetch("/api/schedule", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" }
    })

    if (res.ok) {
      router.push("/dashboard/schedule")
      router.refresh()
    } else {
      alert("Failed to create schedule")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-full p-2 hover:bg-accent transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Schedule Interview</h1>
          <p className="text-muted-foreground">Assign a specific time and location for a candidate&apos;s round.</p>
        </div>
      </div>

      <div className="card p-8 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.1em]">Candidate & Company</label>
            <select name="applicationId" className="w-full rounded-xl border border-input bg-background/50 px-4 py-3.5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none" required>
              <option value="">Select a pending application</option>
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.student.user.name} • {app.company.name} ({app.company.role})
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.1em]">Date & Time</label>
              <input name="dateTime" type="datetime-local" className="w-full rounded-xl border border-input bg-background/50 px-4 py-3.5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.1em]">Venue / URL</label>
              <input name="location" className="w-full rounded-xl border border-input bg-background/50 px-4 py-3.5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" required placeholder="e.g., Seminar Hall or Zoom Link" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-4 text-lg font-black shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all">
            {isLoading ? "Finalizing Schedule..." : "Confirm & Notify Candidate"}
          </button>
        </form>
      </div>
    </div>
  )
}
