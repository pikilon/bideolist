import { SOURCES } from "../constants.js"
// https://api.dailymotion.com/video/x86h9zq&fields=id,title,duration,description,thumbnail_url
// https://developer.dailymotion.com/api/#video-fields
// https://api.dailymotion.com/videos?fields=id,title,description,thumbnail_url&ids=x86h9zq,x14lnch

export const dailymotionFetchVideos = async (id) => {
  if (!id || id.length === 0) return []
  const ids = Array.isArray(id) ? id : [id]
  const idString = ids.join(",")
  const url = [
    "https://api.dailymotion.com/videos" +
      "?fields=id,title,description,duration,thumbnail_url,aspect_ratio",
    `ids=${idString}`,
  ].join("&")
  const response = await fetch(url)
  const { list: videos } = await response.json()
  const formmatedVideos = videos.map(formatDailymotionVideo)
  return formmatedVideos
}

const formatDailymotionVideo = ({
  id,
  title,
  description,
  duration,
  thumbnail_url,
  aspect_ratio,
}) => ({
  id,
  url: `https://www.dailymotion.com/video/${id}`,
  componsedId: `${SOURCES.DAILYMOTION.ID}:${id}`,
  source: SOURCES.DAILYMOTION.ID,
  title,
  description,
  thumbUrl: thumbnail_url,
  durationSeconds: duration,
  aspectRatio: aspect_ratio,
})
