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

export const sortVideosBySource = (compoundIds) => {
  const bySource = {
    [SOURCES.YOUTUBE.ID]: [],
    [SOURCES.DAILYMOTION.ID]: [],
    [SOURCES.VIMEO.ID]: [],
  }
  for (const videoParam of compoundIds) {
    const [source, id] = videoParam.split(":")
    bySource[source].push(id)
  }

  return bySource
}
export const fetchAllVideosFromCompundsIds = (compoundIds) => {
  const videos = sortVideosBySource(compoundIds)

  return fetchAllVideos(videos)
}

export const fetchAllVideos = async (bySource) => {
  const allVideosPromises = sourcesArray.map(({ id, fetch }) => {
    const ids = bySource[id]
    return fetch(ids)
  })
  const allVideos = (await Promise.all(allVideosPromises)).flat()
  const videosMap = {}
  for (const video of allVideos) {
    const id = `${video.source}:${video.id}`

    videosMap[id] = video
  }

  return videosMap
}
