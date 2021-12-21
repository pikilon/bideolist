//https://developers.google.com/youtube/v3/getting-started?hl=es#Sample_Partial_Requests

import { YOUTUBE_API_KEY } from "/config.js"

const wrapUrlWithApiKey = (url) => `${url}&key=${YOUTUBE_API_KEY}`

export const youtubeFetchVideos = async (id) => {
  const ids = Array.isArray(id) ? id : [id]
  const idString = ids.join(",")
  const url = [
    "https://www.googleapis.com/youtube/v3/videos" +
      "?part=snippet,contentDetails",
    "fields=items(id,snippet(title,description,thumbnails),contentDetails(duration,projection))",
    `id=${idString}`,
  ].join("&")
  const response = await fetch(wrapUrlWithApiKey(url))
  const { items: videos } = await response.json()
  const formmatedVideos = videos.map(formatYoutubeVideo)
  return formmatedVideos
}

// "PT15M51S"
// "PT1H16M39S"
const getYoutubeVideoDurationSeconds = (duration) => {
  const [hours, minutes, seconds] = duration
    .match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    .slice(1)
    .map((v) => (v ? parseInt(v.replace(/\D/g, "")) : 0))
  return hours * 3600 + minutes * 60 + seconds
}
const formatYoutubeVideo = (video) => {
  const {
    id,
    snippet: { title, description, thumbnails },
    contentDetails: { duration, projection },
  } = video
  const durationSeconds = getYoutubeVideoDurationSeconds(duration)
  return {
    id,
    title,
    description,
    thumbUrl: thumbnails.default.url,
    durationSeconds,
    projection,
  }
}
