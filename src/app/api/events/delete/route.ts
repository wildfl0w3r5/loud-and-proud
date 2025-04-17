import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "ORGANIZER") {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  const form = await req.formData()
  const eventId = Number(form.get("eventId"))

  const event = await prisma.event.findUnique({
    where: { id: eventId }
  })

  if (!event || event.organizerId !== (session.user as any).id) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  await prisma.event.delete({
    where: { id: eventId }
  })

  return NextResponse.redirect(new URL("/dashboard", req.url))
}
