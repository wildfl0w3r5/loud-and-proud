"use client"

import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/utils/uploadthing"

export default function EventImageUploader({
  onUpload
}: {
  onUpload: (url: string) => void
}) {
  return (
    <div className="relative w-full text-center">
      
      <label className="cursor-pointer border border-primary text-primary px-6 py-2 rounded font-medium hover:bg-primary hover:text-black transition mx-auto block ">
        Upload Event Poster

        
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
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
    </div>
  )
}
