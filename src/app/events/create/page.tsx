import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import EventForm from "@/app/components/EventForm"
import { PrismaClient } from "@prisma/client"
import Footer from "@/app/components/Footer"
import Navbar from "@/app/components/Navbar"

export default async function CreateEventPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    redirect("/login")
  }

  const prisma = new PrismaClient()
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true }
  })

  if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
    redirect("/unauthorized")
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/bgg.avif")' }}
    >
      <Navbar />

      <main className="bg-[#0a0a0add] backdrop-blur-md max-w-3xl mx-auto my-12 p-8 rounded-lg border border-gray-700 shadow-xl">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Create New Event</h1>
        <EventForm organizerId={user.id} />
      </main>

      <Footer />
    </div>
  )
}
