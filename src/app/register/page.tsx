"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { register } from "@/backend/actions/register"

export default function RegisterPage() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const res = await register(formData)

    if (res?.error) {
      setError(res.error)
      setIsLoading(false)
    } else {
      router.push("/login?registered=true")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="card w-full max-w-md p-8 shadow-lg">
        <div className="flex justify-center mb-6">
           <Image src="/logo without text.png" alt="CampusHireX Icon" width={48} height={48} className="object-contain drop-shadow-sm" priority />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-center">Create an Account</h1>
        <p className="mb-6 text-sm text-muted-foreground text-center">
          Join CampusHireX to manage your placements
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full py-2.5"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}
