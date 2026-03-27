"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MarkAsRead() {
  const router = useRouter()

  useEffect(() => {
    const markAsRead = async () => {
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          body: JSON.stringify({}),
        })
        router.refresh()
      } catch (err) {
        console.error("Failed to mark notifications as read", err)
      }
    }

    markAsRead()
  }, [router])

  return null
}
