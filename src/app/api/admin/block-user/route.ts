import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const userId = Number(form.get("userId"))
  const action = form.get("action")

  if (!userId || (action !== "block" && action !== "unblock")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: userId },
    data: { status: action === "block" ? false : true }
  })

  return NextResponse.redirect(new URL("/admin", req.url))
}
