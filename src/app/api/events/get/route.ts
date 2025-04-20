import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"))
  const event = await prisma.event.findUnique({ where: { id } })
  return NextResponse.json(event)
}
