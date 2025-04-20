"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import TicketCard from "../components/TicketCard"

export default function TicketHistoryPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)

  const searchParams = useSearchParams()
  const pidx = searchParams.get("pidx")

  // STEP 1: Verify payment with Khalti
  useEffect(() => {
    const verifyPaymentAndFetch = async () => {
      if (pidx && !verified) {
        const res = await fetch("/api/pay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pidx })
        })
        const result = await res.json()
        console.log("✅ Ticket verified:", result)
        
        if (result.success) {
          setVerified(true)
        }
      }

      // STEP 2: Load tickets
      const ticketRes = await fetch("/api/tickets/me")
      const ticketData = await ticketRes.json()
      setTickets(ticketData)
      setLoading(false)
    }

    verifyPaymentAndFetch()
  }, [pidx, verified])

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/bg.jpg")' }}
    >
      <Navbar />

      <main className="bg-[#0a0a0add] backdrop-blur-md max-w-6xl mx-auto my-10 p-6 rounded-lg border border-gray-700 shadow-xl text-white">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Your Tickets</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : tickets.length === 0 ? (
          <p className="text-center text-gray-300">You haven’t bought any tickets yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket: any) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
