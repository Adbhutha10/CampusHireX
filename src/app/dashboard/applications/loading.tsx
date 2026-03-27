export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-12 w-64 bg-slate-200 rounded-2xl" />
        <div className="h-4 w-96 bg-slate-100 rounded-xl mt-4" />
      </div>

      <div className="bg-white/50 backdrop-blur-xl rounded-[32px] overflow-hidden border border-slate-100 h-[600px]">
        <div className="p-8 space-y-6">
          <div className="flex gap-4 border-b border-slate-50 pb-6">
            <div className="h-4 w-24 bg-slate-100 rounded" />
            <div className="h-4 w-32 bg-slate-100 rounded" />
            <div className="h-4 w-24 bg-slate-100 rounded" />
            <div className="h-4 w-24 bg-slate-100 rounded" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center py-4">
              <div className="h-12 w-12 bg-slate-50 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-slate-100 rounded" />
                <div className="h-3 w-32 bg-slate-50 rounded" />
              </div>
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="h-8 w-32 bg-slate-50 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
