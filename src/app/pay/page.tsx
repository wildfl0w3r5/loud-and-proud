import { PrismaClient } from "@prisma/client"
import { notFound, redirect } from "next/navigation"

interface SearchParams {
  searchParams: {
    eventId?: string
    quantity?: string
  }
}

export default async function PayPage({ searchParams }: SearchParams) {
  const prisma = new PrismaClient()
  const eventId = Number(searchParams.eventId)
  const quantity = Number(searchParams.quantity)

  if (!eventId || !quantity || quantity < 1) redirect("/events")

  const event = await prisma.event.findUnique({
    where: { id: eventId }
  })

  if (!event) notFound()

  const total = quantity * event.price

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Complete Your Payment</h1>

      {event.image && (
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-64 object-cover rounded"
        />
      )}

      <div className="space-y-2">
        <p><strong>Event:</strong> {event.name}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Ticket Price:</strong> NPR {event.price.toFixed(2)}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p className="text-lg font-semibold"><strong>Total:</strong> NPR {(total).toFixed(2)}</p>
      </div>

      <form method="POST" action="/api/pay">
        <input type="hidden" name="eventId" value={eventId} />
        <input type="hidden" name="quantity" value={quantity} />
        <input type="hidden" name="amount" value={total} />

        <button type="submit" className="bg-purple-700 text-white px-5 py-2 rounded">
          Pay Now
        </button>
      </form>
    </main>
  )
}
