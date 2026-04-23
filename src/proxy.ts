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

  // Protect API routes (except auth + uploadthing webhook callbacks)
  // /api/uploadthing must be whitelisted: UploadThing's servers POST to it as a
  // server-to-server webhook with no user session. It authenticates via HMAC signature.
  if (
    nextUrl.pathname.startsWith("/api") &&
    !nextUrl.pathname.startsWith("/api/auth") &&
    !nextUrl.pathname.startsWith("/api/uploadthing")
  ) {
    if (!isLoggedIn) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
}
