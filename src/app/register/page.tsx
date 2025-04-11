"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "", role:"ATTENDEE" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const hashedPassword = await bcrypt.hash(form.password, 10)

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ ...form, password: hashedPassword }),
      headers: { "Content-Type": "application/json" }
    })

    if (res.ok) router.push("/login")
    else alert("Registration failed!")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h2 className="text-2xl mb-4">Register</h2>
        <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full mb-2" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full mb-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full mb-2" />
        <div className="mb-2">
        <label className="block mb-1 font-medium">Register as:</label>
        <label className="mr-4">
        <input
        type="radio"
        name="role"
        value="ATTENDEE"
        checked={form.role === "ATTENDEE"}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        /> Attendee
        </label>
        <label>
        <input
        type="radio"
        name="role"
        value="ORGANIZER"
        checked={form.role === "ORGANIZER"}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        /> Organizer
        </label>
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">Sign Up</button>
      </form>
    </div>
  )
}
