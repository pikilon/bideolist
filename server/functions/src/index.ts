import * as functions from "firebase-functions"
import fetch from "cross-fetch"

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const getVideosInfo = functions.https.onRequest(
  async (request, response) => {
    const twitchUrl = "https://www.twitch.tv/videos/1267815693"
    const twitchResponse = await fetch(twitchUrl)
    const twitchData = await twitchResponse.text();
    functions.logger.info("Hello logs!", { structuredData: true })
    response.send("Hello from Firebase!" + `<textarea>${twitchData}</textarea>`)
  }
)
