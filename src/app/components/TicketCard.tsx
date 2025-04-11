"use client"

import { Ticket, Event } from "@prisma/client"
import { QRCodeCanvas } from "qrcode.react"

interface Props {
  ticket: Ticket & { event: Event }
}

export default function TicketCard({ ticket }: Props) {
  // For now, use localhost. Later, replace with your actual domain.
  const qrData = `🎟️ Loud & Proud Ticket\nEvent: ${ticket.event.name}\nTicket ID: ${ticket.id}\nUser ID: ${ticket.userId}`

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-semibold">{ticket.event.name}</h2>
      <p><strong>Location:</strong> {ticket.event.location}</p>
      <p><strong>Date:</strong> {new Date(ticket.event.date).toLocaleString()}</p>
      <p><strong>Quantity:</strong> {ticket.quantity}</p>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Purchased:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>

      <div className="mt-4">
        <p className="text-sm mb-2">Scan this QR at entry:</p>
        <QRCodeCanvas value={qrData} size={128} />
      </div>
    </div>
  )
}
