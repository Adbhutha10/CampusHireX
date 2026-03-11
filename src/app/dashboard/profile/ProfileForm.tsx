"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfileForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const res = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" }
    })

    if (!res.ok) {
        setError("Failed to update profile. Make sure Roll Number is unique.")
        setIsLoading(false)
    } else {
        router.push("/dashboard")
        router.refresh()
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Roll Number</label>
          <input name="rollNumber" defaultValue={initialData?.rollNumber} className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" required placeholder="e.g., 2021CS01" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Academic Branch</label>
          <select name="branch" defaultValue={initialData?.branch} className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" required>
            <option value="">Select Branch</option>
            <option value="CSE">Computer Science</option>
            <option value="ECE">Electronics</option>
            <option value="ME">Mechanical</option>
            <option value="EE">Electrical</option>
            <option value="CE">Civil</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Current CGPA</label>
          <input name="cgpa" type="number" step="0.01" max="10" defaultValue={initialData?.cgpa} className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" required placeholder="e.g., 8.5" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Contact Number</label>
          <input name="contact" defaultValue={initialData?.contact} className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" required placeholder="e.g., +91 9876543210" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Key Skills</label>
        <textarea name="skills" defaultValue={initialData?.skills} className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" required placeholder="List your technical skills separated by commas (e.g., Java, React, SQL, AWS)" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Resume Link</label>
        <input name="resumeUrl" type="url" defaultValue={initialData?.resumeUrl} className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="Provide a drive or dropbox link to your PDF resume" />
      </div>

      {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">{error}</div>}

      <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-4 text-lg font-semibold shadow-lg hover:shadow-primary/30 transition-all">
        {isLoading ? "Updating Profile..." : (initialData ? "Save Changes" : "Create Profile")}
      </button>
    </form>
  )
}
