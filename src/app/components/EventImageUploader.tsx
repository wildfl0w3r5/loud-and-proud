"use client"

import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/utils/uploadthing"

export default function EventImageUploader({
  onUpload
}: {
  onUpload: (url: string) => void
}) {
  return (
    <UploadButton<OurFileRouter>
      endpoint="eventImageUploader"
      onClientUploadComplete={(res) => {
        if (res && res[0]) {
          onUpload(res[0].url)
        }
      }}
      onUploadError={(error) => {
        alert(`Upload failed: ${error.message}`)
      }}
    />
  )
}
