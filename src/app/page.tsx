import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Link from "next/link"
import UserMenu from "./components/UserMenu"
import Image from "next/image"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex flex-col items-center text-center text-foreground">
      
      <div className="mt-12 mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-primary">Loud & Proud</h1>
        <p className="text-gray-400 text-sm mt-2">Join us —  and be Loud, be Proud.</p>
        <img src="/logo.png" alt="Loud & Proud Logo" className="w-40 md:w-56 mx-auto mb-4 hover:scale-105 transition duration-200"/>

      </div>

      
      {!session ? (
        <div className="flex gap-6 mb-16">
          <Link
            href="/register"
            className="border border-primary text-primary px-6 py-2 rounded font-medium hover:bg-primary hover:text-black transition"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="border border-primary text-primary px-6 py-2 rounded font-medium hover:bg-primary hover:text-black transition"
          >
            Login
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mb-16">
          <Link href="/dashboard" className="border border-primary text-primary px-6 py-2 rounded font-medium hover:bg-primary hover:text-black transition">Go to Dashboard</Link>
          <UserMenu email={session.user?.email || ""} />
        </div>
      )}

      
      <section className="max-w-2xl text-left space-y-3 mb-24">
        <h2 className="text-2xl font-semibold text-primary">About Us</h2>
        <p className="text-gray-300">
          Loud & Proud is more than just a Ticketing platform. It is a place for folks who speak up, stand tall,and celebrate who they are and where they come from.
          We specialize in musical gigs but that does not limit us. Whether you are organizing a local gig or a global movement, we are here to support your cause.
          Our platform is built to to power any kind of events. From concerts to festivals, workshops or art exhibition, we provide latest and convinient tools for both Attendees and Organizers.
          Attendees can discover events,buy tickets and stay informed from anywhere. Organizers can create events, manage ticket sales, and track attendess with ease.

        </p>
        <p className="text-gray-400 text-sm">
          "Carpe Diem"
        </p>
      </section>

    
      <footer className="w-full border-t border-gray-800 py-6 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Loud & Proud. All rights reserved.</p>
      </footer>
    </main>
  )
}
