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
const getVideosFromString = (videosString) =>
  videosString.split(",").map((videoParam) => {
    const [source, id] = videoParam.split(":")
    return { source, id }
  })
export const fetchAllVideosFromString = (videosString) =>
  fetchAllVideos(getVideosFromString(videosString))

export const fetchAllVideos = async (sourceIdArray) => {
  const videosBySource = sourceIdArray.reduce(
    (acc, { source, id }) => {
      if (acc[source]) acc[source].push(id)
      return acc
    },
    {
      [SOURCES.YOUTUBE.ID]: [],
      [SOURCES.DAILYMOTION.ID]: [],
      [SOURCES.VIMEO.ID]: [],
    }
  )
  const allVideosPromises = sourcesArray.map(({ id, fetch }) => {
    const ids = videosBySource[id]
    return fetch(ids)
  })
  const allVideos = await Promise.all(allVideosPromises)
  const videosMap = allVideos.reduce((acc, videos) => {
    videos.forEach((video) => {
      acc[video.id] = video
    })
    return acc
  }, {})
  const videosOrdered = sourceIdArray.map(({ id }) => videosMap[id])
  return { videosOrdered, videosMap }
}
