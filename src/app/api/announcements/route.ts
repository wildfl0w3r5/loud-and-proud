import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const formData = await req.formData()
  const eventId = Number(formData.get("eventId"))
  const message = formData.get("message")?.toString().trim()

  if (!eventId || !message) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  // Check if the logged-in user owns the event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { organizer: true }
  })

  if (!event || (event.organizerId !== (session.user as any).id)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  await prisma.announcement.create({
    data: {
      message,
      eventId
    }
  })

  return NextResponse.redirect(new URL("/dashboard", req.url))
}
