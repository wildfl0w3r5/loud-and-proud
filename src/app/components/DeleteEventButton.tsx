"use client"

import { useState } from "react"

export default function DeleteEventButton({ eventId }: { eventId: number }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this event?")
    if (!confirmed) return

    setIsSubmitting(true)

    const res = await fetch("/api/events/delete", {
      method: "POST",
      body: new URLSearchParams({ eventId: String(eventId) }),
    })

    if (res.ok) {
      window.location.reload()
    } else {
      alert("Failed to delete event")
    }

    setIsSubmitting(false)
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 underline"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Deleting..." : "Delete"}
    </button>
  )
}
