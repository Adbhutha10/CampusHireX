import { auth } from "./backend/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Protect dashboard routes
  if (nextUrl.pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
  }

  // Protect API routes (except auth)
  if (nextUrl.pathname.startsWith("/api") && !nextUrl.pathname.startsWith("/api/auth")) {
    if (!isLoggedIn) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
}
