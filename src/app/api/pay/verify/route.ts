import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const { pidx } = await req.json()

  const res = await fetch("https://dev.khalti.com/api/v2/epayment/lookup/", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ pidx })
  })

  

  const result = await res.json()
   console.log("🧾 KHALTI LOOKUP RESULT:", result)

   if (result.status === "Completed") {
    // ✅ Get payment session from our database
    const sessionData = await prisma.paymentSession.findUnique({
      where: { pidx }
    })

    if (!sessionData) {
      console.error("❌ No matching PaymentSession for pidx:", pidx)
      return NextResponse.json({ success: false, error: "Payment session not found" })
    }

    const { eventId, quantity, userId } = sessionData

    try {
      await prisma.ticket.create({
        data: {
          userId,
          eventId,
          quantity,
          status: "PAID"
        }
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("❌ Error creating ticket:", error)
      return NextResponse.json({ success: false, error: "Database error" })
    }
  }

  return NextResponse.json({ success: false, status: result.status })
}