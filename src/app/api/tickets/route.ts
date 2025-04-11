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
  const action = formData.get("action")?.toString()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (!["BOOK", "BUY"].includes(action || "")) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
  
  if (action === "BOOK") {
    // Check if already booked
    const existingBooking = await prisma.ticket.findFirst({
      where: {
        userId: user.id,
        eventId: eventId,
        status: "BOOKED"
      }
    })

    if (existingBooking) {
      return NextResponse.json({ message: "You’ve already booked a ticket for this event." }, { status: 400 })
    }

    // Create new booked ticket
    await prisma.ticket.create({
      data: {
        userId: user.id,
        eventId: eventId,
        quantity: quantity,
        status: "BOOKED",
      },
    })

    return NextResponse.redirect(new URL("/tickets", req.url))
  }

  if (action === "BUY") {
    // No booking check needed — allow multiple paid tickets
    return NextResponse.redirect(new URL(`/pay?eventId=${eventId}&quantity=${quantity}`, req.url))
  }
  

  return NextResponse.json({ error: "Unhandled action" }, { status: 400 })
}
