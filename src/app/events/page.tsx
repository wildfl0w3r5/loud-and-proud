import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default async function EventListPage({ searchParams }: { searchParams: { location?: string } }) {
  const session = await getServerSession(authOptions)
  const prisma = new PrismaClient()

  const locationQuery = searchParams.location?.trim().toLowerCase() || ""

  const events = await prisma.event.findMany({
    where: locationQuery
      ? { location: { contains: locationQuery, mode: "insensitive" } }
      : {},
    orderBy: { date: "asc" }
  })

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/bg.jpg")' }}
    >
      <Navbar />

      <main className="bg-[#0a0a0add] backdrop-blur-md max-w-5xl mx-auto my-10 p-6 rounded-lg border border-gray-700 shadow-xl ">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Explore Events</h1>

        {/*Search Form */}
        <form method="GET" className="mb-8 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            name="location"
            placeholder="Search by location..."
            defaultValue={searchParams.location || ""}
            className="w-full sm:w-80 px-4 py-2 rounded bg-[#1a1a1a] border border-gray-600 text-white"/>
          <button type="submit" className="ml-auto border border-white text-white px-6 py-2 rounded font-medium hover:bg-primary hover:text-white transition">
            Search
          </button>
        </form>

        {events.length === 0 ? (
          <p className="text-gray-300">No events found.</p>
        ) : (
          <ul className="space-y-8">
            {events.map((event) => (
              <li key={event.id} className="bg-[#121212] border border-gray-700 p-5 rounded-lg shadow transition-all duration-300 hover:brightness-110 hover:scale-[1.015] hover:shadow-lg">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full max-h-[600px] object-contain rounded border border-gray-700"
                  />
                )}

                <h2 className="text-xl font-semibold text-white">{event.name}</h2>
                <p className="text-primary-300">{event.description}</p>
                <p>Date: {new Date(event.date).toLocaleString()}</p>
                <p>Location: {event.location}</p>
                <p>Capacity: {event.capacity}</p>
                <p>Price: NPR {event.price}</p>

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
                      className="border px-2 py-1 w-24 bg-[#1a1a1a] text-white border-gray-600 rounded"
                    />

                    <label className="block text-sm mt-2 mb-1">Choose an option:</label>
                    <label className="mr-4">
                      <input type="radio" name="action" value="BOOK" defaultChecked /> Book
                    </label>
                    <label>
                      <input type="radio" name="action" value="BUY" /> Buy
                    </label>

                    <button
                      type="submit"
                      className="border border-primary text-primary px-6 py-2 rounded font-medium hover:bg-primary hover:text-white transition mx-auto block"
                    >
                      Confirm
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  )
}
