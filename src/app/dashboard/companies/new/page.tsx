"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewCompanyPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const res = await fetch("/api/companies", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" }
    })

    if (res.ok) {
      router.push("/dashboard/companies")
      router.refresh()
    } else {
      alert("Failed to create company")
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
          <h1 className="text-3xl font-bold tracking-tight">Register Company</h1>
          <p className="text-muted-foreground">Add a new visiting company to the placement portal.</p>
        </div>
      </div>

      <div className="card p-8 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Company Name</label>
            <input name="name" className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required placeholder="e.g., Google, Microsoft" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Job Role</label>
              <input name="role" className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required placeholder="e.g., Software Engineer" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Package (CTC)</label>
              <input name="package" className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required placeholder="e.g., 25 LPA" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Min. CGPA Criteria</label>
              <input name="criteria" type="number" step="0.1" className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required placeholder="e.g., 7.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Application Deadline</label>
              <input name="deadline" type="date" className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Job Description</label>
            <textarea name="description" className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 min-h-[150px] focus:ring-2 focus:ring-primary outline-none transition-all" required placeholder="Enter role responsibilities and requirements..." />
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-4 text-lg font-bold shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98]">
            {isLoading ? "Registering..." : "Post Job Opening"}
          </button>
        </form>
      </div>
    </div>
  )
}
