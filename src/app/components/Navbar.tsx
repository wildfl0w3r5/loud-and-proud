"use client"

import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  return (
    <header className="bg-[#0a0a0a] border-b border-gray-800 shadow-md py-4 px-6">
      <div className="w-full max-w-[1440px] mx-auto flex flex-wrap justify-between items-center gap-4">
        
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Loud & Proud" width={40} height={40} />
          <span className="text-primary text-xl font-bold">Loud & Proud</span>
        </Link>

        
        <nav className="flex gap-6 text-sm text-gray-300">
          <Link href="/events" className="hover:text-primary transition">Events</Link>
          <Link href="/events/create" className="hover:text-primary transition">Create a Event</Link>
          <Link href="/dashboard" className="hover:text-primary transition">Dashboard</Link>
          <Link href="/tickets" className="hover:text-primary transition">My Tickets</Link>
          <Link href="/report" className="hover:text-primary transition">Report</Link>
        </nav>
      </div>
    </header>
  )
}
