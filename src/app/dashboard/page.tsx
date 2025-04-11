import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import UserMenu from "../components/UserMenu"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login") // 🔒 Block access if not logged in
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p><strong>Email:</strong> {session.user?.email}</p>
      <p><strong>Name:</strong> {session.user?.name}</p>
      <p><strong>Role:</strong> {(session.user as any).role }</p>

       {<Link href="/report" className="text-blue-600 underline">
        Report an Issue
        </Link>
          }
          
       {["ATTENDEE", "ORGANIZER"].includes((session.user as any).role) && (
        <Link href="/report" className="text-blue-600 underline mt-4 inline-block">
          Report an Issue
        </Link>
      )}

      <UserMenu email={session.user?.email || ""} />
    </main>
  )
  
}
