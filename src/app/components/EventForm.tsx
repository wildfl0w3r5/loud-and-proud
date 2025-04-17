"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import EventImageUploader from "./EventImageUploader"

export default function EventForm({ organizerId }: { organizerId: number }) {
  const [imageUrl, setImageUrl] = useState("")
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    capacity: 100,
    date: "",
    price:  0
  })

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, organizerId, capacity: Number(form.capacity), price: Number(form.price), image: imageUrl})
    })

    if (res.ok) {
      alert("Event Created!")
      router.push("/dashboard")
    } else {
      alert("Failed to create event")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-3 mx-auto block">
      <input name="name" placeholder="Event Name" onChange={handleChange} className="border p-2 w-full" required />
      <textarea name="description" placeholder="Event Description" onChange={handleChange} className="border p-2 w-full" required />
      <input name="location" placeholder="Location" onChange={handleChange} className="border p-2 w-full" required />
      <input name="date" type="datetime-local" onChange={handleChange} className="border p-2 w-full" required />
      <input name="capacity" type="number" placeholder="Capacity" onChange={handleChange} className="border p-2 w-full" />
      <input name="price" type="number" placeholder="Ticket price (in NPR)" onChange={handleChange} className="border p-2 w-full" />

      <EventImageUploader onUpload={(url) => setImageUrl(url)} />
      {imageUrl && (
      <img src={imageUrl} alt="Preview" className="w-full max-h-64 object-cover rounded border mt-2" />
      )}
      <button type="submit" className="border border-primary text-primary px-6 py-2 rounded font-medium hover:bg-primary hover:text-black transition mx-auto block">Create Event</button>
    </form>
  )
}
