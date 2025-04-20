"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function PayPage() {
  const searchParams = useSearchParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const eventId = Number(searchParams.get("eventId"))
  const quantity = Number(searchParams.get("quantity"))

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId || !quantity || quantity < 1) return
      const res = await fetch(`/api/events/get?id=${eventId}`)
      const data = await res.json()
      setEvent(data)
    }

    fetchEvent()
  }, [eventId, quantity])

  const total = event ? event.price * quantity : 0

  const handlePay = async () => {
    setLoading(true)

    const res = await fetch("/api/pay", {
      method: "POST",
      body: new URLSearchParams({
        eventId: String(eventId),
        quantity: String(quantity),
        amount: String(total),
      })
    })

    const data = await res.json()

    if (data.payment_url) {
      window.location.href = data.payment_url
    } else {
      alert("Failed to initiate payment")
      setLoading(false)
    }
  }

  if (!event) return <p className="p-6">Loading event...</p>

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Complete Your Payment</h1>

      {event.image && (
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-64 object-cover rounded"
        />
      )}

      <div className="space-y-2">
        <p><strong>Event:</strong> {event.name}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Ticket Price:</strong> NPR {event.price}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p className="text-lg font-semibold"><strong>Total:</strong> NPR {total.toFixed(2)}</p>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="bg-purple-700 text-white px-5 py-2 rounded"
      >
        {loading ? "Redirecting..." : "Pay Now"}
      </button>
    </main>
  )
}
