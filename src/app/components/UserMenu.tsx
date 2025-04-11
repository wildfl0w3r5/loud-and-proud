"use client"

import { signOut } from "next-auth/react"

interface Props {
  email: string
}

export default function UserMenu({ email }: Props) {
  return (
    <div className="mt-4">
      <p className="mb-2">Logged in as {email}</p>
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  )
}
