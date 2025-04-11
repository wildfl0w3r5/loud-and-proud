import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, description, location, date, capacity, price, organizerId, image } = body

    const event = await prisma.event.create({
      data: {
        name,
        description,
        location,
        date: new Date(date),
        capacity,
        price,
        organizerId,
        image
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Event creation failed" }, { status: 500 })
  }
}
