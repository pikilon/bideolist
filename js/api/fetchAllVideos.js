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
  videosString.split(",").map((videoParam, order) => {
    const [source, id] = videoParam.split(":")
    return { source, id, order }
  })
export const fetchAllVideosFromString = (videosString) =>
  fetchAllVideos(getVideosFromString(videosString))

export const fetchAllVideos = async (sourceIdArray) => {
  const { orderMap, ...videosBySource } = sourceIdArray.reduce(
    (acc, { source, id, order }) => {
      if (acc[source]) acc[source].push(id)
      acc.orderMap[`${source}:${id}`] = order
      return acc
    },
    {
      [SOURCES.YOUTUBE.ID]: [],
      [SOURCES.DAILYMOTION.ID]: [],
      [SOURCES.VIMEO.ID]: [],
      orderMap: {},
    }
  )
  const allVideosPromises = sourcesArray.map(({ id, fetch }) => {
    const ids = videosBySource[id]
    return fetch(ids)
  })
  const allVideos = await Promise.all(allVideosPromises)
  const result = allVideos.reduce(
    (acc, videos) => {
      videos.forEach((video) => {
        const id = `${video.source}:${video.id}`
        const order = orderMap[id]
        acc.videosMap[id] = acc.videosOrdered[order] = video
      })
      return acc
    },
    { videosMap: {}, videosOrdered: [] }
  )
  return result
}
