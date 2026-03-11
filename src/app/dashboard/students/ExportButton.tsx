"use client"

export default function ExportButton({ data }: { data: any[] }) {
  const downloadCSV = () => {
    const headers = ["Name", "Email", "Roll Number", "Branch", "CGPA", "Applications"]
    const rows = data.map(s => [
      s.user.name,
      s.user.email,
      s.rollNumber,
      s.branch,
      s.cgpa,
      s._count.applications
    ])

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "student_placement_data.csv")
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button 
      onClick={downloadCSV} 
      className="btn border border-primary text-primary px-6 py-2.5 hover:bg-primary/5 flex items-center gap-2 font-bold shadow-sm transition-all active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Export Student Data
    </button>
  )
}
