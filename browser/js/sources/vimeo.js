import { SOURCES } from "../constants.js"

export const VIMEO_FETCH_VIDEOS_INFO_URL = "https://noembed.com/embed?url=https://vimeo.com/"

export const fetchVimeoVideos = (id) => {
  if (!id || id.length === 0) return []
  const ids = Array.isArray(id) ? id : [id]
  const promises = ids.map((id) => fetch(VIMEO_FETCH_VIDEOS_INFO_URL + id).then(res => res.json()).then(formatVimeoVideo))
  return Promise.all(promises)
}

const extractIdFromVimeoUrl = (url) => {
  const [, id] = url.match(/\/(?:videos|vimeo\.com)\/(\d+)/i)
  return id
}

const formatVimeoVideo = ({
  uri,
  title,
  description,
  thumbnail_url,
  duration,
  width,
  height,
}) => {
  const id = extractIdFromVimeoUrl(uri)
  return {
    id,
    url: `https://vimeo.com/${id}`,	
    composedId: `${SOURCES.VIMEO.ID}:${id}`,
    source: SOURCES.VIMEO.ID,
    title,
    description: description,
    thumbUrl: thumbnail_url,
    durationSeconds: duration,
    aspectRatio: width / height,
  }
}

