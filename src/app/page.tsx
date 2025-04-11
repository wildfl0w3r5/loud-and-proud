import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Link from "next/link"
import UserMenu from "./components/UserMenu"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Loud & Proud</h1>
      {session ? (
        <>
          <Link href="/dashboard" className="underline text-blue-600">Go to Dashboard</Link>
          <Link href="/tickets" className="text-blue-600 underline">View My Tickets</Link>

          <UserMenu email={session.user?.email || ""} />
        </>
      ) : (
        <Link href="/login" className="underline text-blue-600">Login</Link>
      )}
    </main>
  )
}
