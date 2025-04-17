import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const formData = await req.formData()
  const eventId = Number(formData.get("eventId"))
  const quantity = Number(formData.get("quantity"))
  const amount = Number(formData.get("amount"))

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || !eventId || !quantity || quantity < 1) {
    return NextResponse.json({ error: "Invalid payment info" }, { status: 400 })
  }

  // 👇 Simulate payment success
  await prisma.ticket.create({
    data: {
      userId: user.id,
      eventId,
      quantity,
      status: "PAID",
    },
  })

  return NextResponse.redirect(new URL("/tickets", req.url))
}
