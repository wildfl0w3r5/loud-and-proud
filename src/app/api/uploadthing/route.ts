import { createNextRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "@/utils/uploadthing"

export const { GET, POST } = createNextRouteHandler({
    router: ourFileRouter,
  })
  