"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EditCompanyPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [company, setCompany] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/companies/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setCompany(data)
        setIsFetching(false)
      })
  }, [params.id])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const res = await fetch(`/api/companies/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" }
    })

    if (res.ok) {
      router.push("/dashboard/companies")
      router.refresh()
    } else {
      alert("Failed to update company")
      setIsLoading(false)
    }
  }

  if (isFetching) return <div className="p-20 text-center animate-pulse">Loading company details...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-full p-2 hover:bg-accent transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Company</h1>
          <p className="text-muted-foreground">Modify the details for {company.name}.</p>
        </div>
      </div>

      <div className="card p-8 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Company Name</label>
            <input name="name" defaultValue={company.name} className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Job Role</label>
              <input name="role" defaultValue={company.role} className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Package (CTC)</label>
              <input name="package" defaultValue={company.package} className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Min. CGPA Criteria</label>
              <input name="criteria" type="number" step="0.1" defaultValue={company.criteria} className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Application Deadline</label>
              <input name="deadline" type="date" defaultValue={new Date(company.deadline).toISOString().split('T')[0]} className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Job Description</label>
            <textarea name="description" defaultValue={company.description} className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 min-h-[150px] focus:ring-2 focus:ring-primary outline-none transition-all" required />
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-4 text-lg font-bold shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98]">
            {isLoading ? "Saving..." : "Update Company Details"}
          </button>
        </form>
      </div>
    </div>
  )
}
