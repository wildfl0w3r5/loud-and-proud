import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function seed() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "abhisheksapkota05@gmail.com" }
  })

  if (existingAdmin) {
    console.log("Admin already exists.")
    return
  }

  const hashedPassword = await bcrypt.hash("555555", 10)

  await prisma.user.create({
    data: {
      name: "Abhishek Admin",
      email: "abhisheksapkota05@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      status: true
    }
  })

  console.log("✅ Admin created successfully!")
}

seed().finally(() => prisma.$disconnect())
