"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Invalid email or password")
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="card w-full max-w-md p-8 shadow-lg">
        <div className="flex justify-center mb-6">
           <Image src="/logo without text.png" alt="CampusHireX Icon" width={48} height={48} className="object-contain drop-shadow-sm" priority />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-center">Login to CampusHireX</h1>
        <p className="mb-6 text-sm text-muted-foreground text-center">
          Enter your credentials to access your dashboard
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="name@university.edu"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full py-2.5">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
