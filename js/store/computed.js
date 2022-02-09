import { subscribe } from "./bus.js"
import { STORE_NAMES, storeSelector } from "./store.js"

export const selectVideosAndDurations = () => {
  const videosMap = storeSelector(STORE_NAMES.VIDEOS_DICTIONARY)
  const { compoundIds, activeVideo, listName } = storeSelector(STORE_NAMES.URL)

  const videos = []
  let duration = 0
  let durationBefore = 0
  for (let index = 0; index < compoundIds.length; index++) {
    const id = compoundIds[index]
    const video = videosMap[id]
    if (!video) continue
    videos.push(video)
    duration += video.durationSeconds
    if (index < activeVideo) durationBefore += video.durationSeconds
  }

  return { videos, duration, durationBefore, compoundIds, listName, activeVideo }
}

export const subscribeVideosDuration = (callback) => {
  const callbackWrapper = () => callback(selectVideosAndDurations())
  const unsubscribeVideosMap = subscribe(
    STORE_NAMES.VIDEOS_DICTIONARY,
    callbackWrapper
  )
  const unsubscribeUrl = subscribe(STORE_NAMES.URL, callbackWrapper)
  const unsubscribeVideosDuration = () => {
    unsubscribeVideosMap()
    unsubscribeUrl()
  }
  const currentValue = selectVideosAndDurations()
  return [currentValue, unsubscribeVideosDuration]
}
