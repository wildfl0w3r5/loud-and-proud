import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password, role } = body

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return NextResponse.json({ error: "User exists" }, { status: 400 })

    await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: email === "abhisheksapkota@gmail.com" ? "ADMIN" : (role)
      }
    })

    return NextResponse.json({ message: "User created!" }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
