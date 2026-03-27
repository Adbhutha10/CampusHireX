export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-10 w-64 bg-slate-200 rounded-2xl" />
          <div className="h-4 w-96 bg-slate-100 rounded-xl mt-4" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 h-14 bg-white/50 rounded-[20px] border border-slate-100" />
        <div className="w-48 h-14 bg-white/50 rounded-2xl border border-slate-100" />
        <div className="w-32 h-14 bg-white/50 rounded-2xl border border-slate-100" />
      </div>

      <div className="bg-white/50 backdrop-blur-xl rounded-[40px] border border-slate-100 h-[500px] p-8 space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-slate-100 rounded" />
              <div className="h-3 w-32 bg-slate-50 rounded" />
            </div>
            <div className="h-8 w-32 bg-slate-50 rounded-full" />
            <div className="h-10 w-20 bg-slate-50 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
