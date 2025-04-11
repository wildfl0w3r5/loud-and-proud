import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"

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
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Users</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="border p-4 rounded shadow">
              <p><strong>{user.name}</strong> ({user.email})</p>
              <p>Role: {user.role} | Status: {user.status ? "Active" : "Blocked"}</p>
              <form method="POST" action="/api/admin/block-user">
                <input type="hidden" name="userId" value={user.id} />
                <button
                  type="submit"
                  name="action"
                  value={user.status ? "block" : "unblock"}
                  className={`mt-2 px-4 py-1 text-white rounded ${
                    user.status ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {user.status ? "Block" : "Unblock"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Events</h2>
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{event.name}</h3>
              <p>Organizer: {event.organizer.name} ({event.organizer.email})</p>
              <p>Date: {new Date(event.date).toLocaleString()}</p>
              <p>Location: {event.location}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Reports</h2>
        <ul className="space-y-2">
          {reports.map((report) => (
            <li key={report.id} className="border p-4 rounded shadow">
              <p><strong>From:</strong> {report.fromUser.name} ({report.fromUser.role})</p>
              <p className="text-gray-700 mt-1">“{report.message}”</p>
              <p className="text-sm text-gray-400 mt-1">{new Date(report.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
