"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-xl rounded-[40px] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-2">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Oops! Something went wrong</h2>
          <p className="text-slate-500 font-medium">
            We&apos;ve encountered an unexpected error. Don&apos;t worry, our team has been notified and is looking into it.
          </p>
        </div>

        {error.digest && (
          <div className="bg-slate-50 py-2 px-4 rounded-xl inline-block">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Error ID: {error.digest}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group"
          >
            <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
          
          <a
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-white text-slate-600 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <Home size={18} />
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
