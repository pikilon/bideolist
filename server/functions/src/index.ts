import * as functions from "firebase-functions"
import { youtubeFetchVideos } from "./sources/youtube"
import initCors from "cors"
import { searchScrapper } from "./search-bideos"

const cors = initCors({ origin: true })

export const youtube = functions.https.onRequest(async (request, response) =>
  cors(request, response, async () => {
    if (request.method !== "GET") {
      response.status(405).send("Method not allowed")
      return
    }
    const { ids } = request.query
    if (!ids) {
      response.status(400).send("Missing ids")
      return
    }

    const videos = await youtubeFetchVideos((ids as string).split(","))
    response.json(videos)
    response.end()
  })
)
export const search = functions.https.onRequest(async (request, response) =>
  cors(request, response, async () => {
    if (request.method !== "GET") {
      response.status(405).send("Method not allowed")
      return
    }
    const { query } = request.query
    if (!query) {
      response.status(400).send("Missing query")
      return
    }

    const html = await searchScrapper(query as string)
    response.json({ html })
    response.end()
  })
)
