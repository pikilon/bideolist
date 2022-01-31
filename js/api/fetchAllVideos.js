import { SOURCES } from "../constants.js"
import { dailymotionFetchVideos } from "../sources/dailymotion.js"
import { fetchVimeoVideos } from "../sources/vimeo.js"
import { youtubeFetchVideos } from "../sources/youtube.js"

const sourcesArray = [
  { id: SOURCES.YOUTUBE.ID, fetch: youtubeFetchVideos },
  { id: SOURCES.DAILYMOTION.ID, fetch: dailymotionFetchVideos },
  { id: SOURCES.VIMEO.ID, fetch: fetchVimeoVideos },
]

export const generateVideosString = (sourceIdArray) =>
  sourceIdArray.map(({ source, id }) => `${source}:${id}`).join(",")

const getVideosFromString = (compoundIds) => {
  const videos = []
  const bySource = {
    [SOURCES.YOUTUBE.ID]: [],
    [SOURCES.DAILYMOTION.ID]: [],
    [SOURCES.VIMEO.ID]: [],
  }
  const orderMap = {};
  for (const videoParam of compoundIds) {
    const [source, id] = videoParam.split(":")
    const order = videos.length;

    videos.push({ source, id })
    orderMap[videoParam] = order
    bySource[source].push(id)
  }

  return { videos, orderMap, bySource }
}
export const fetchAllVideosFromString = (compoundIds) => {
  const videos = getVideosFromString(compoundIds)

  return fetchAllVideos(videos)
}

export const fetchAllVideos = async ({ orderMap, bySource }) => {
  const allVideosPromises = sourcesArray.map(({ id, fetch }) => {
    const ids = bySource[id]
    return fetch(ids)
  })
  const allVideos = (await Promise.all(allVideosPromises)).flat()

  const videosMap = {}
  const orderedVideos = []
  let duration = 0

  for (const video of allVideos) {
    const id = `${video.source}:${video.id}`
    const order = orderMap[id]

    videosMap[id] = orderedVideos[order] = video
    duration += video.durationSeconds
  }

  return { videos: orderedVideos, videosMap, duration }
}
