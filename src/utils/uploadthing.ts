import { createUploadthing, type FileRouter } from "uploadthing/server"
import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const f = createUploadthing()

export const ourFileRouter = {
  eventImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions)
      if (!session || (session.user as any).role !== "ORGANIZER") throw new Error("Unauthorized")
      return { userId: session.user.id! }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload complete:", file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
