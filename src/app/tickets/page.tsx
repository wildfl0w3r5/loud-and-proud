import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import TicketCard from "../components/TicketCard"

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

  // 🔒 Role check goes RIGHT HERE
  if (!user || (user.role !== "ATTENDEE" && user.role !== "ADMIN")) {
    redirect("/unauthorized")
  }

  if (user.tickets.length === 0) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Your Tickets</h1>
        <p>You haven’t bought any tickets yet.</p>
      </main>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Tickets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </main>
  )
}
