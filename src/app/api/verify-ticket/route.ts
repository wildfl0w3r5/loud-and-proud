import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const ticketId = req.nextUrl.searchParams.get("id")

  if (!ticketId) {
    return NextResponse.json({ error: "Missing ticket ID" }, { status: 400 })
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: Number(ticketId) },
    include: { event: true }
  })

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
  }

  return NextResponse.json(ticket)
}
