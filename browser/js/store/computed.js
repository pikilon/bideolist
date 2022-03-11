import { subscribe } from "./bus.js"
import { STORE_NAMES, getUnsubscribeValue, storeSelector } from "./store.js"

export const filterUnknowVideos = (compoundIds) => {
  const videosMap = storeSelector(STORE_NAMES.VIDEOS_DICTIONARY)
  const unknownVideos = compoundIds.filter(
    (composedId) => !videosMap[composedId]
  )
  return unknownVideos
}

export const subscribeActiveVideo = (activeVideoCallback) => {
  const wrapperCallback = () => {
    const active = storeSelector(STORE_NAMES.ACTIVE)
    const videos = storeSelector(STORE_NAMES.VIDEOS)
    const videosMap = storeSelector(STORE_NAMES.VIDEOS_DICTIONARY)
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
  const unsubscribeVideosMap = getUnsubscribeValue({
    storeName: STORE_NAMES.VIDEOS_DICTIONARY,
    callback: wrapperCallback,
  })

  wrapperCallback()

  const unsubscribe = () => {
    unsubscribeActive()
    unsubscribeVideos()
    unsubscribeVideosMap()
  }

  return unsubscribe
}

export const getUnsubscribeVideosTotalDuration = (
  callbackVideosTotalDuration
) => {
  const callback = () => {
    const videosMap = storeSelector(STORE_NAMES.VIDEOS_DICTIONARY)
    const compoundIds = storeSelector(STORE_NAMES.VIDEOS)
    const videos = []
    const videosEnds = []
    let totalDuration = 0
    for (const composedId of compoundIds) {
      const video = videosMap[composedId]
      if (!video) continue
      totalDuration += video.durationSeconds
      videosEnds.push(totalDuration)
      videos.push(video)
    }
    callbackVideosTotalDuration({
      videos,
      totalDuration,
      videosEnds,
      compoundIds,
      videosMap,
    })
  }
  callback()

  const unsubscribeVideos = subscribe(STORE_NAMES.VIDEOS, callback)
  const unsubscribeVideosMap = subscribe(
    STORE_NAMES.VIDEOS_DICTIONARY,
    callback
  )

  const unsubscribe = () => {
    unsubscribeVideos()
    unsubscribeVideosMap()
  }
  return unsubscribe
}
