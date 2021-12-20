import { YOUTUBE_API_KEY } from "/config.js"

const wrapUrlWithApiKey = (url) => `${url}&key=${YOUTUBE_API_KEY}`

export const youtubeFetchVideos = async (id) => {
  const ids = Array.isArray(id) ? id : [id]
  const idString = ids.join(",")
  const url = [
    "https://www.googleapis.com/youtube/v3/videos" +
      "?part=snippet,contentDetails",
    "fields=items(id,snippet(title,channelTitle,thumbnails),contentDetails(duration,projection))",
    `id=${idString}`,
  ].join("&")
  const response = await fetch(wrapUrlWithApiKey(url))
  return response.json()
}
