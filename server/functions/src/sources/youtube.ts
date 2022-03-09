import { SOURCES } from "../constants"
import fetch from "cross-fetch"
//https://developers.google.com/youtube/v3/getting-started?hl=es#Sample_Partial_Requests

type YoutubeVideoType = {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: { [key: string]: { url: string } }
  }
  contentDetails: { duration: string; projection: string }
}

export const youtubeFetchVideos = async (id: string | string[]) => {
  if (!id || id.length === 0) return []
  const ids = Array.isArray(id) ? id : [id]
  const idString = ids.join(",")
  const url = [
    "https://www.googleapis.com/youtube/v3/videos" +
      "?part=snippet,contentDetails",
    "fields=items(id,snippet(title,description,thumbnails),contentDetails(duration,projection))",
    `id=${idString}`,
    `key=${process.env.YOUTUBE_API_KEY}`,
  ].join("&")
  const { items: videos }: { items: Array<YoutubeVideoType> } = await fetch(
    url
  ).then((res) => res.json())
  console.log('videos', videos);
  const formmatedVideos = videos.map(formatYoutubeVideo)
  return formmatedVideos
}

// "PT15M51S"
// "PT1H16M39S"
const getYoutubeVideoDurationSeconds = (duration: string) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return 0
  const [hours, minutes, seconds] = match
    .slice(1)
    .map((amount: string) => (amount ? parseInt(amount.replace(/\D/g, "")) : 0))
  return hours * 3600 + minutes * 60 + seconds
}

const formatYoutubeVideo = (video: YoutubeVideoType) => {
  const {
    id,
    snippet: { title, description, thumbnails },
    contentDetails: { duration, projection },
  } = video
  const durationSeconds = getYoutubeVideoDurationSeconds(duration)
  return {
    id,
    url: `https://www.youtube.com/watch?v=${id}`,
    componsedId: `${SOURCES.YOUTUBE.ID}:${id}`,
    source: SOURCES.YOUTUBE.ID,
    title,
    description,
    thumbUrl: thumbnails.default.url,
    durationSeconds,
    projection,
  }
}

const EXAMPLE_IDS = ["7lCDEYXw3mM", "RUyTN9hajHY", "YEW_UFm4Xe4"]

youtubeFetchVideos(EXAMPLE_IDS).then(console.log)
