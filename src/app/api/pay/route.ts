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

  const event = await prisma.event.findUnique({
    where: { id: eventId }
  })

  if (!user || !eventId || !quantity || quantity < 1) {
    return NextResponse.json({ error: "Invalid payment info" }, { status: 400 })
  }

  const payload = {
    return_url: process.env.KHALTI_RETURN_URL,
    website_url: process.env.KHALTI_WEBSITE_URL,
    amount: amount * 100, // convert to paisa
    purchase_order_id: `event-${eventId}-qty-${quantity}-${Date.now()}`,
    purchase_order_name: event!.name,
    customer_info: {
      name: user.name,
      email: user.email,
      phone: "9800000000", // Replace with real user phone if available
    },
    product_details: [
      {
        identity: `event-${event!.id}`,
        name: event!.name,
        total_price: amount * 100,
        quantity,
        unit_price: event!.price * 100
      }
    ]
  }

  const khaltiRes = await fetch("https://dev.khalti.com/api/v2/epayment/initiate/", {
    method: "POST",
    headers: {
      "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
      "User-Agent": "loud-and-proud-app"
      
    },
    body: JSON.stringify(payload)
  })

  const responseData = await khaltiRes.json()
  console.log("✅ KHALTI RESPONSE:", JSON.stringify(responseData, null, 2))
  console.log("🔥 Sending Khalti Payload:", JSON.stringify(payload, null, 2))

  if (!responseData?.pidx || !responseData?.payment_url) {
    return NextResponse.json({ error: "Failed to initiate Khalti payment" }, { status: 500 })
  }

  await prisma.paymentSession.create({
    data: {
      pidx: responseData.pidx,
      userId: user.id,
      eventId,
      quantity
    }
  })
  

  // Redirect user to Khalti's payment gateway
  return NextResponse.json({ payment_url: responseData.payment_url })

}
