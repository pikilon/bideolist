import { subscribe } from "./bus.js"
import { STORE_NAMES, getUnsubscribeValue, storeSelector } from "./store.js"

export const selectVideosAndDurations = ({ videosMap, compoundIds }) => {
  const videos = []
  let duration = 0
  for (let index = 0; index < compoundIds.length; index++) {
    const id = compoundIds[index]
    const video = videosMap[id]
    if (!video) continue
    videos.push(video)
    duration += video.durationSeconds
  }

  return {
    videos,
    duration,
  }
}

export const getUnsubscribeVideosDuration = (videosDurationCallback) => {
  const callback = () => {
    const videosMap = storeSelector(STORE_NAMES.VIDEOS_DICTIONARY)
    const compoundIds = storeSelector(STORE_NAMES.VIDEOS)
    const videosDuration = selectVideosAndDurations({ videosMap, compoundIds })
    videosDurationCallback(videosDuration)
  }
  const unsubscribeVideos = subscribe(STORE_NAMES.VIDEOS, callback)
  const unsubscribeVideosMap = subscribe(
    STORE_NAMES.VIDEOS_DICTIONARY,
    callback
  )

  //initialize
  callback()

  const unsubscribe = () => {
    unsubscribeVideos()
    unsubscribeVideosMap()
  }
  return unsubscribe
}
