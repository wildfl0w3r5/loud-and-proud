import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import DeleteEventButton from "../components/DeleteEventButton"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"


const prisma = new PrismaClient()

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      events: {
        include: {
          tickets: {
            where: { status: "PAID" }
          }
        }
      }
    }
  })

  if (!user) redirect("/login")

  const role = user.role

  if (role === "ADMIN") {
    redirect("/admin")
  }

  if (role === "ATTENDEE") {
    redirect("/tickets")
  }

  // ORGANIZER Dashboard
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/bg.jpg")' }}
    >
      <Navbar />

      <main className="bg-[#0a0a0add] backdrop-blur-sm border border-gray-700 shadow-xl max-w-5xl mx-auto my-10 p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-primary">Organizer Dashboard</h1>

        {user.events.length === 0 ? (
          <p className="text-gray-300">You haven’t created any events yet.</p>
        ) : (
          <ul className="space-y-6">
            {user.events.map(event => {
              const totalSold = event.tickets.reduce((sum, t) => sum + t.quantity, 0)
              const totalRevenue = totalSold * event.price

              return (
                <li key={event.id} className="bg-[#121212] border border-gray-700 rounded p-5 shadow space-y-2">
                   {event.image && (
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-primary">{event.name}</h2>
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                  <p><strong>Tickets Sold:</strong> {totalSold}</p>
                  <p><strong>Revenue:</strong> NPR {totalRevenue.toFixed(2)}</p>

                  <Link
                    href={`/eventid?id=${event.id}`}
                    className="border border-primary text-primary px-6 py-2 rounded font-medium hover:bg-primary hover:text-black transition"
                  >
                    View Attendees
                  </Link>

                  <div className="flex gap-4 mt-2 text-sm">
                    <Link
                      href={`/edit-event?id=${event.id}`}
                      className="text-blue-400 underline"
                    >
                      Edit
                    </Link>
                    <DeleteEventButton eventId={event.id} />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  )
}