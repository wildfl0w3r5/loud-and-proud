"use client"

import { signOut } from "next-auth/react"

interface Props {
  email: string
}

export default function UserMenu({ email }: Props) {
  return (
    <div className="mt-4">
      
      <button
        onClick={() => signOut()}
        className="border border-primary text-primary px-6 py-2 rounded font-medium hover:bg-primary hover:text-white transition">
        Logout
        </button>
      <p className="mb-2">Logged in as {email}</p>
    </div>
  )
}
