"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function TicketVerifyPage() {
  const searchParams = useSearchParams()
  const ticketId = searchParams.get("id")
  const [ticket, setTicket] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!ticketId) {
      setError("Ticket ID not found in the URL.")
      return
    }

    const fetchTicket = async () => {
      const res = await fetch(`/api/verify-ticket?id=${ticketId}`)
      if (res.ok) {
        const data = await res.json()
        setTicket(data)
      } else {
        setError("Ticket not found or invalid.")
      }
    }

    fetchTicket()
  }, [ticketId])

  if (error) return <main className="p-6 text-red-600">{error}</main>
  if (!ticket) return <main className="p-6">Loading ticket info...</main>

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎟️ Ticket Verification</h1>
      <p><strong>Ticket ID:</strong> {ticket.id}</p>
      <p><strong>Event:</strong> {ticket.event.name}</p>
      <p><strong>Location:</strong> {ticket.event.location}</p>
      <p><strong>Date:</strong> {new Date(ticket.event.date).toLocaleString()}</p>
      <p><strong>Quantity:</strong> {ticket.quantity}</p>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Purchased:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
    </main>
  )
}
