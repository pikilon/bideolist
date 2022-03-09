import { SOURCES } from "../constants"
import fetch from "cross-fetch"

// vimeo with URIs https://developer.vimeo.com/api/reference/videos?version=3.4#search_videos
// uris /videos/253497000,/videos/81329596

// https://api.vimeo.com/videos?uris=%2Fvideos%2F253497000,%2Fvideos%2F81329596

type VimeoVideo = {
  uri: string
  name: string
  description: string
  pictures: { sizes: Array<{ link: string }> }
  duration: number
  width: number
  height: number
}

const headers = {
  Authorization: `bearer ${process.env.VIMEO_API_KEY}`,
  Accept: "application/vnd.vimeo.*+json;version=3.4",
  "Content-Type": "application/json",
}

const fields = [
  "uri",
  "name",
  "description",
  "pictures",
  "duration",
  "width",
  "height",
].join(",")

export const fetchVimeoVideos = async (id: string | string[]) => {
  if (!id || id.length === 0) return []
  const ids = Array.isArray(id) ? id : [id]

  const urisString = ids.map((id) => `/videos/${id}`).join(",")
  const vimeoUrl = encodeURI(
    `https://api.vimeo.com/videos?uris=${urisString}&fields=${fields}`
  )

  const json = await fetch(vimeoUrl, { headers }).then((res) => res.json())
  const videos: Array<VimeoVideo> = json.data
  return videos.map(formatVimeoVideo)
}

const extractIdFromVimeoUrl = (url = "") => {
  const match = url.match(/\/(?:videos|vimeo\.com)\/(\d+)/i)
  const [, id] = match || []
  return id
}

const formatVimeoVideo = ({
  uri,
  name,
  description,
  pictures,
  duration,
  width,
  height,
}: VimeoVideo) => {
  const id = extractIdFromVimeoUrl(uri)
  return {
    id,
    url: `https://vimeo.com/${id}`,
    componsedId: `${SOURCES.VIMEO.ID}:${id}`,
    source: SOURCES.VIMEO.ID,
    title: name,
    description: description,
    thumbUrl: pictures.sizes[1].link,
    durationSeconds: duration,
    aspectRatio: width / height,
  }
}

const testIds = ["221538677", "81329596"]

fetchVimeoVideos(testIds).then((videos) => console.log("videos", videos))
