export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-12 w-64 bg-slate-200 rounded-2xl" />
        <div className="h-4 w-96 bg-slate-100 rounded-xl mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/50 backdrop-blur-xl rounded-[32px] p-6 border border-slate-100 space-y-4 h-64">
            <div className="flex justify-between">
              <div className="h-12 w-12 bg-slate-100 rounded-2xl" />
              <div className="h-6 w-24 bg-slate-50 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-slate-100 rounded" />
              <div className="h-4 w-32 bg-slate-50 rounded" />
            </div>
            <div className="pt-4 flex gap-2">
              <div className="h-6 w-16 bg-slate-50 rounded-lg" />
              <div className="h-6 w-16 bg-slate-50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
