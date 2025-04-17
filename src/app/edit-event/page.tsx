import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"

interface Props {
  searchParams: {
    id: string
  }
}

export default async function EditEventPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "ORGANIZER") {
    redirect("/unauthorized")
  }

  const eventId = Number(searchParams.id)
  const prisma = new PrismaClient()

  const event = await prisma.event.findUnique({
    where: { id: eventId }
  })

  if (!event || event.organizerId !== (session.user as any).id) {
    redirect("/dashboard")
  }

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Edit Event</h1>
      <form action="/api/events/edit" method="POST" className="space-y-4">
        <input type="hidden" name="eventId" value={event.id} />
        <input name="name" defaultValue={event.name} className="border p-2 w-full" />
        <textarea name="description" defaultValue={event.description} className="border p-2 w-full" />
        <input name="location" defaultValue={event.location} className="border p-2 w-full" />
        <input type="datetime-local" name="date" defaultValue={new Date(event.date).toISOString().slice(0, 16)} className="border p-2 w-full" />
        <input type="number" name="capacity" defaultValue={event.capacity} className="border p-2 w-full" />
        <input type="number" name="price" defaultValue={event.price} className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </main>
  )
}
