import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function EventListPage() {
  const session = await getServerSession(authOptions)
  const prisma = new PrismaClient()
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } })

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Events</h1>

      {events.length === 0 ? (
        <p>No events yet!</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
           <li key={event.id} className="border p-4 rounded shadow space-y-2">
           {event.image && (
             <img
               src={event.image}
               alt={event.name}
               className="w-full h-48 object-cover rounded"
             />
           )}
           <h2 className="text-xl font-semibold">{event.name}</h2>
           <p>{event.description}</p>
           <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
           <p><strong>Location:</strong> {event.location}</p>
           <p><strong>Capacity:</strong> {event.capacity}</p>
         
           {session?.user && (
             <form action="/api/tickets" method="POST">
               <input type="hidden" name="eventId" value={event.id} />
               <label className="block mt-2 text-sm">How many tickets? (1–15)</label>
               <input
                 type="number"
                 name="quantity"
                 defaultValue={1}
                 min={1}
                 max={15}
                 className="border px-2 py-1 w-24"
               />
               <button
                 type="submit"
                 className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
               >
                 Buy Ticket
               </button>
             </form>
           )}
         </li>
         
          ))}
        </ul>
      )}
    </main>
  )
}
