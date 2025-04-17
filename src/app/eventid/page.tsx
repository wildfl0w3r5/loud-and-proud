import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect, notFound } from "next/navigation"

interface Props {
  searchParams: {
    id: string
  }
}

export default async function AttendeeListPage({ searchParams }: Props) {
  const eventId = Number(searchParams.id)

  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "ORGANIZER") {
    redirect("/unauthorized")
  }

  const prisma = new PrismaClient()

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      tickets: {
        where: { status: "PAID" },
        include: { user: true }
      }
    }
  })

  if (!event || event.organizerId !== (session.user as any).id) {
    notFound()
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Attendees for {event.name}</h1>
      <ul className="space-y-3">
        {event.tickets.map((ticket) => (
          <li key={ticket.id} className="border rounded p-3 shadow">
            <p><strong>{ticket.user.name}</strong> ({ticket.user.email})</p>
            <p>Tickets Bought: {ticket.quantity}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
