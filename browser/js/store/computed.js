import { STORE_NAMES, getUnsubscribeValue, storeSelector } from "./store.js"
import { getBideosMapDB } from "../db.js"

export const subscribeActiveVideo = (activeVideoCallback) => {
  const wrapperCallback = async () => {
    const active = storeSelector(STORE_NAMES.ACTIVE)
    const videos = storeSelector(STORE_NAMES.VIDEOS)
    const videosMap = await getBideosMapDB(videos)
    const activeId = videos[active]
    const activeVideo = videosMap[activeId]
    activeVideoCallback(activeVideo)
  }
  const unsubscribeActive = getUnsubscribeValue({
    storeName: STORE_NAMES.ACTIVE,
    callback: wrapperCallback,
  })
  const unsubscribeVideos = getUnsubscribeValue({
    storeName: STORE_NAMES.VIDEOS,
    callback: wrapperCallback,
  })

  wrapperCallback()

  const unsubscribe = () => {
    unsubscribeActive()
    unsubscribeVideos()
  }

  return unsubscribe
}

export const getUnsubscribeVideosTotalDuration = (callbackDuration) => {
  const compoundIdsCallback = async (compoundIds) => {
    const videosMap = await getBideosMapDB(compoundIds)
    const videos = []
    const videosEnds = []
    let totalDuration = 0

    for (const composedId of compoundIds) {
      const video = videosMap[composedId]
      if (!video) continue
      totalDuration += video.durationSeconds
      videos.push(video)
      videosEnds.push(totalDuration)
    }

    callbackDuration({
      videos,
      totalDuration,
      videosEnds,
      compoundIds,
      videosMap,
    })
  }
  const unsubscribeVideos = getUnsubscribeValue({
    storeName: STORE_NAMES.VIDEOS,
    callback: compoundIdsCallback,
  })
  return unsubscribeVideos
}

export const getElapsedVideosTime = (callback) => {
  let totalDuration = 0
  let activeIndex = storeSelector(STORE_NAMES.ACTIVE)
  let videosEnds = []
  const updatedCallback = () => {
    const elapsedTime = videosEnds[activeIndex] || 0
    callback({ elapsedTime, totalDuration })
  }

  const unsubscribeActive = getUnsubscribeValue({
    storeName: STORE_NAMES.ACTIVE,
    callback: (newActive) => {
      activeIndex = newActive
      updatedCallback()
    },
  })

  const unsubscribeVideosEnds = getUnsubscribeVideosTotalDuration(
    (durations) => {
      videosEnds = durations.videosEnds
      totalDuration = durations.totalDuration
      updatedCallback()
    }
  )

  return () => {
    unsubscribeActive()
    unsubscribeVideosEnds()
  }
}
