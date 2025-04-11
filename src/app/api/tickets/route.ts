import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const formData = await req.formData()
  const eventId = Number(formData.get("eventId"))
  const quantity = Number(formData.get("quantity") || 1)
  

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Prevent duplicate ticket purchase
  const existingTicket = await prisma.ticket.findFirst({
    where: {
      userId: user.id,
      eventId: eventId,
    },
  })

  if (existingTicket) {
    return NextResponse.json({ message: "Ticket already purchased" }, { status: 400 })
  }

  await prisma.ticket.create({
    data: {
      userId: user.id,
      eventId: eventId,
      status: "PAID",
      quantity: quantity,
    },
  })

  return NextResponse.redirect(new URL("/events", req.url))
}
