import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import EventForm from "@/app/components/EventForm"
import { PrismaClient } from "@prisma/client"

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
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
      <EventForm organizerId={user.id} />
    </main>
  )
}
