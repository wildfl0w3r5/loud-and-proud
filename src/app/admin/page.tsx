import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== "ADMIN") redirect("/unauthorized")

  const prisma = new PrismaClient()

  const [users, events, reports] = await Promise.all([
    prisma.user.findMany({ where: { role: { in: ["ATTENDEE", "ORGANIZER"] } } }),
    prisma.event.findMany({ include: { organizer: true } }),
    prisma.report.findMany({ include: { fromUser: true }, orderBy: { createdAt: "desc" } })
  ])

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/bg.jpg")' }}
    >
      <Navbar />

      <main className="bg-[#0a0a0add] backdrop-blur-md max-w-6xl mx-auto my-10 p-8 rounded-lg border border-gray-700 shadow-xl text-white">
        <h1 className="text-4xl font-bold text-primary mb-10 text-center">Admin Dashboard</h1>

        {/* Users */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">Users</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((user) => (
              <li key={user.id} className="bg-[#121212] border border-gray-700 p-4 rounded shadow space-y-2">
                <p><strong>{user.name}</strong> ({user.email})</p>
                <p>Role: {user.role} | Status: {user.status ? "Active" : "Blocked"}</p>
                <form method="POST" action="/api/admin/block-user">
                  <input type="hidden" name="userId" value={user.id} />
                  <button
                    type="submit"
                    name="action"
                    value={user.status ? "block" : "unblock"}
                    className={`mt-2 px-4 py-1 rounded text-sm font-medium ${
                      user.status ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                    } transition`}
                  >
                    {user.status ? "Block" : "Unblock"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>

        {/* Events */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">Events</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <li key={event.id} className="bg-[#121212] border border-gray-700 p-4 rounded shadow space-y-2">
                <h3 className="font-semibold text-lg text-white">{event.name}</h3>
                <p>Organizer: {event.organizer.name} ({event.organizer.email})</p>
                <p>Date: {new Date(event.date).toLocaleString()}</p>
                <p>Location: {event.location}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Reports */}
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">Reports</h2>
          <ul className="space-y-4">
            {reports.map((report) => (
              <li key={report.id} className="bg-[#121212] border border-gray-700 p-4 rounded shadow space-y-1">
                <p><strong>From:</strong> {report.fromUser.name} ({report.fromUser.role})</p>
                <p className="text-gray-300">“{report.message}”</p>
                <p className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}
