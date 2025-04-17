import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import TicketCard from "../components/TicketCard"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

export default async function TicketHistoryPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) redirect("/login")

  const prisma = new PrismaClient()
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      tickets: {
        include: { event: true },
        orderBy: { createdAt: "desc" }
      }
    }
  })

  
  if (!user || (user.role !== "ATTENDEE" && user.role !== "ADMIN")) {
    redirect("/unauthorized")
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/bg.jpg")' }}
    >
      <Navbar />

      <main className="bg-[#0a0a0add] backdrop-blur-md max-w-6xl mx-auto my-10 p-6 rounded-lg border border-gray-700 shadow-xl text-white">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Your Tickets</h1>

        {user.tickets.length === 0 ? (
          <p className="text-center text-gray-300">You haven’t bought any tickets yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
