"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import Footer from "../components/Footer"

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
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/bgg.avif")' }}
    >
      <div className="bg-[#0a0a0add] backdrop-blur-md p-8 rounded-lg shadow-md w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 text-white rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 text-white rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 text-white rounded"
            required
          />

          <div className="text-sm text-gray-300">
            <label className="block mb-1 font-medium">Register as:</label>
            <label className="mr-4">
              <input
                type="radio"
                name="role"
                value="ATTENDEE"
                checked={form.role === "ATTENDEE"}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />{" "}
              Attendee
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="ORGANIZER"
                checked={form.role === "ORGANIZER"}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />{" "}
              Organizer
            </label>
          </div>

          <button
            type="submit"
            className="border border-primary text-primary px-6 py-2 rounded font-medium hover:bg-primary hover:text-black transition mx-auto block"
          >
            Sign Up
          </button>
        </form>
      </div>

      <Footer />
    </div>
  )
}
