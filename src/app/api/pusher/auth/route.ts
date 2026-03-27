import { auth } from "@/backend/auth"
import { pusherServer } from "@/backend/lib/pusher"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  const formData = await req.formData()
  const socketId = formData.get("socket_id") as string
  const channel = formData.get("channel_name") as string

  // Simple security check: user can only subscribe to their own private channel
  if (channel !== `private-user-${session.user.id}`) {
    return new NextResponse("Unauthorized channel access", { status: 403 })
  }

  const authResponse = pusherServer.authorizeChannel(socketId, channel)
  return NextResponse.json(authResponse)
}
