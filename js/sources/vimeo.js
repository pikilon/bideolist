
import { SOURCES } from "../constants.js";
import { VIMEO_API_KEY } from "../../config.js"

const headers = {
  Authorization: `bearer ${VIMEO_API_KEY}`,
  Accept: "application/vnd.vimeo.*+json;version=3.4",
  "Content-Type": "application/json",
}

// vimeo with URIs https://developer.vimeo.com/api/reference/videos?version=3.4#search_videos
// uris /videos/253497000,/videos/81329596

// https://api.vimeo.com/videos?uris=%2Fvideos%2F253497000,%2Fvideos%2F81329596

export const fetchVimeoVideos = async (id) => {
  if (!id || id.length === 0) return [];
  const ids = Array.isArray(id) ? id : [id]
  const fields = [
    "uri",
    "name",
    "description",
    "pictures",
    "duration",
    "width",
    "height",
  ].join(",")
  const urisString = ids.map((id) => `/videos/${id}`).join(",")
  const vimeoUrl = encodeURI(
    `https://api.vimeo.com/videos?uris=${urisString}&fields=${fields}`
  )

  const response = await fetch(vimeoUrl, { headers })
  const { data: videos } = await response.json()
  return videos.map(formatVimeoVideo)
}

const extractIdFromVimeoUrl = (url) => {
  const [, id] = url.match(/\/(?:videos|vimeo\.com)\/(\d+)/i)
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
}) => ({
  id: extractIdFromVimeoUrl(uri),
  source: SOURCES.VIMEO.ID,
  title: name,
  description: description,
  thumbUrl: pictures.sizes[1].link,
  durationSeconds: duration,
  aspectRatio: width / height,
})
