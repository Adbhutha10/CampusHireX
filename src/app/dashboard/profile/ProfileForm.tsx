"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadDropzone } from "@/shared/utils/uploadthing"
import { 
  User, 
  GraduationCap, 
  Globe, 
  MessageSquare, 
  Linkedin, 
  Github, 
  Phone, 
  FileText
} from "lucide-react"
import { cn } from "@/backend/lib/utils"

export default function ProfileForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resumeUrl, setResumeUrl] = useState(initialData?.resumeUrl || "")
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    formData.append("resumeUrl", resumeUrl)

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
    <form onSubmit={onSubmit} className="space-y-12">
      {/* Section 1: Personal Identity */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <User size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Personal Identity</h3>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
           <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Gender</label>
             <select name="gender" defaultValue={initialData?.gender} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contact Number</label>
             <div className="relative">
               <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input name="contact" defaultValue={initialData?.contact} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium" required placeholder="+91 98765 43210" />
             </div>
           </div>
        </div>
      </div>

      {/* Section 2: Academic Excellence */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <GraduationCap size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Academic Excellence</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Roll Number</label>
            <input name="rollNumber" defaultValue={initialData?.rollNumber} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-bold text-slate-900" required placeholder="e.g., 2021CS01" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Branch</label>
            <select name="branch" defaultValue={initialData?.branch} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium" required>
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics</option>
              <option value="ME">Mechanical</option>
              <option value="EE">Electrical</option>
              <option value="CE">Civil</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Year of Study</label>
            <select name="year" defaultValue={initialData?.year || 1} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium" required>
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cumulative CGPA</label>
            <input name="cgpa" type="number" step="0.01" max="10" defaultValue={initialData?.cgpa} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-bold text-slate-900" required placeholder="e.g., 8.5" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Batch (e.g. 2021-25)</label>
            <input name="batchYear" defaultValue={initialData?.batchYear} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium" placeholder="2021-2025" />
          </div>
        </div>
      </div>

      {/* Section 3: Professional Presence */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Globe size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Professional Presence</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">LinkedIn Profile</label>
            <div className="relative">
              <Linkedin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="linkedinUrl" type="url" defaultValue={initialData?.linkedinUrl} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-medium" placeholder="https://linkedin.com/in/username" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">GitHub Portfolio</label>
            <div className="relative">
              <Github size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="githubUrl" type="url" defaultValue={initialData?.githubUrl} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-medium" placeholder="https://github.com/username" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Resume Link (PDF)</label>
          {resumeUrl ? (
            <div className="flex items-center gap-3 p-4 border border-emerald-200 bg-emerald-50 rounded-2xl">
              <FileText className="text-emerald-500" size={20} />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-emerald-900 truncate">{resumeUrl}</p>
                <p className="text-xs text-emerald-600 font-medium">Resume PDF Uploaded Successfully!</p>
              </div>
              <button 
                type="button" 
                onClick={() => setResumeUrl("")} 
                className="px-3 py-1 bg-white text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition shadow-sm">
                Replace
              </button>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl bg-white p-2">
              <UploadDropzone
                endpoint="resumeUploader"
                onClientUploadComplete={(res) => {
                  console.log("[UploadThing] onClientUploadComplete fired", res);
                  if (res?.[0]) {
                    // UploadThing v7 uses ufsUrl as the canonical URL
                    const uploadedUrl = (res[0] as any).ufsUrl ?? res[0].url;
                    console.log("[UploadThing] Setting resume URL to:", uploadedUrl);
                    setResumeUrl(uploadedUrl);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error("[UploadThing] Upload error:", error);
                  setError(`Resume Upload Failed: ${error.message}`);
                }}
                appearance={{
                  button: "bg-indigo-600 font-bold hover:bg-indigo-700 text-white!",
                  container: "border-dashed border-2 border-indigo-200 hover:border-indigo-400 focus:border-indigo-500 bg-slate-50 rounder-xl transition-all",
                  label: "text-indigo-600 font-bold"
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Experience & Skills */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <MessageSquare size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Experience & Skills</h3>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Professional Bio</label>
          <textarea name="bio" defaultValue={initialData?.bio} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 min-h-[100px] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none font-medium" placeholder="Briefly describe your career goals and what you bring to the table..." />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Technical Skills</label>
          <textarea name="skills" defaultValue={initialData?.skills} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 min-h-[100px] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none font-medium" required placeholder="Python, React, Tailwind, SQL, Git..." />
        </div>
      </div>

      {error && <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 animate-shake">{error}</div>}

      <div className="pt-4">
        <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white rounded-2xl py-4 text-sm font-black uppercase tracking-widest hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50">
          {isLoading ? "Synchronizing Profile..." : (initialData ? "Apply Detailed Updates" : "Initialize Professional Profile")}
        </button>
      </div>
    </form>
  )
}
