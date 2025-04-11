import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const formData = await req.formData()
  const message = formData.get("message")?.toString()

  if (!message || message.trim().length < 5) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 })
  }

  await prisma.report.create({
    data: {
      message,
      fromUserId: session.user.id
    }
  })

  return NextResponse.redirect(new URL("/dashboard", req.url))
}
