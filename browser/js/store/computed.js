import { subscribe } from "./bus.js"
import { STORE_NAMES, getUnsubscribeValue, storeSelector } from "./store.js"

const getVideosDuration = ({ videosMap, compoundIds }) => {
  const videos = []
  let duration = 0

  for (let index = 0; index < compoundIds.length; index++) {
    const id = compoundIds[index]
    const video = videosMap[id]
    if (!video) continue
    videos.push(video)
    duration += video.durationSeconds
  }

  return { videos, duration }
}

const getVideosDurationBefore = (videos, active) => {
  let durationBefore = 0
  for (let index = 0, video = videos[index]; index < active; index++) {
    durationBefore += video.durationSeconds
  }
  return durationBefore
}

export const subscribeVideosDurationBefore = (videosDurationBeforeCallback) => {
  let result = {
    videos: [],
    duration: 0,
    durationBefore: 0,
    active: storeSelector(STORE_NAMES.ACTIVE),
  }
  const wrapperCallback = (partialResult) => {
    result = { ...result, ...partialResult }
    result.active = storeSelector(STORE_NAMES.ACTIVE)
    result.durationBefore = getVideosDurationBefore(
      result.videos,
      result.active
    )
    videosDurationBeforeCallback(result)
  }
  const unsubscribeVideosDuration =
    getUnsubscribeVideosDuration(wrapperCallback)
  const unsubscribeActive = getUnsubscribeValue({
    storeName: STORE_NAMES.ACTIVE,
    callback: wrapperCallback,
  })
  const unsubscribe = () => {
    unsubscribeVideosDuration()
    unsubscribeActive()
  }
  return unsubscribe
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

export const getUnsubscribeVideosDuration = (videosDurationCallback) => {
  const callback = () => {
    const videosMap = storeSelector(STORE_NAMES.VIDEOS_DICTIONARY)
    const compoundIds = storeSelector(STORE_NAMES.VIDEOS)
    const videosDuration = getVideosDuration({ videosMap, compoundIds })
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
