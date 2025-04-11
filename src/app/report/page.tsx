import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function ReportPage() {
  const session = await getServerSession(authOptions)

  if (!session || !["ORGANIZER", "ATTENDEE"].includes((session.user as any).role)) {
    redirect("/unauthorized")
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit a Report</h1>
      <form action="/api/report" method="POST" className="space-y-4">
        <textarea
          name="message"
          placeholder="Describe the issue or suspicious activity..."
          required
          className="w-full border p-3 rounded"
        />
        <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded">
          Submit Report
        </button>
      </form>
    </main>
  )
}
