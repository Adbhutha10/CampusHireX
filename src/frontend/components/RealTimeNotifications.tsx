"use client"

import { useEffect } from "react"
import { pusherClient } from "@/backend/lib/pusher-client"
import toast, { Toaster } from "react-hot-toast"
import { Bell, CheckCircle, Info } from "lucide-react"

interface RealTimeNotificationsProps {
  userId: string
}

export default function RealTimeNotifications({ userId }: RealTimeNotificationsProps) {
  useEffect(() => {
    if (!userId) return

    const channel = pusherClient.subscribe(`private-user-${userId}`)

    channel.bind("status-updated", (data: { message: string, status: string, companyName: string }) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-2xl rounded-3xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-indigo-50 p-4`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                {data.status === "SELECTED" ? (
                  <CheckCircle className="h-10 w-10 text-emerald-500 bg-emerald-50 p-2 rounded-2xl" />
                ) : (
                  <Bell className="h-10 w-10 text-indigo-500 bg-indigo-50 p-2 rounded-2xl" />
                )}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  Application Update
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500 leading-relaxed">
                  {data.message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-slate-50">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-3xl p-4 flex items-center justify-center text-xs font-black text-indigo-600 hover:text-indigo-500 focus:outline-none uppercase tracking-widest"
            >
              Close
            </button>
          </div>
        </div>
      ), {
        duration: 8000,
        position: 'top-right',
      })
    })

    return () => {
      pusherClient.unsubscribe(`private-user-${userId}`)
    }
  }, [userId])

  return <Toaster />
}
