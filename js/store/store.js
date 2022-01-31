import { subscribe, emit } from "./bus.js"

export const STORE_NAMES = {
  VIDEOS_DICTIONARY: "VIDEOS_DICTIONARY",
  VIDEOS: "VIDEOS",
  DURATION: "DURATION",
}

const localStorageVideosDictionary = localStorage.getItem(
  STORE_NAMES.VIDEOS_DICTIONARY
)
const videosDictionaryFirstValue = localStorageVideosDictionary
  ? JSON.parse(localStorageVideosDictionary)
  : {}

const storeHistory = {
  [STORE_NAMES.VIDEOS_DICTIONARY]: [videosDictionaryFirstValue],
  [STORE_NAMES.VIDEOS]: [],
  [STORE_NAMES.DURATION]: [],
}

const persistStorage = (storeName, value) => {
  localStorage.setItem(storeName, JSON.stringify(value))
}

const storeSetter =
  (storeName, persist = false) =>
  (value) => {
    const storeSlice = storeHistory[storeName]
    storeSlice.push(value)
    if (persist) persistStorage(storeName, value)
    console.log("storeHistory", storeName, storeSlice)
    emit(storeName, value)
  }
export const storeSelector = (storeName) => {
  const storeSlice = storeHistory[storeName]

  return storeSlice[storeSlice.length - 1]
}

export const setVideosDictionary = (value) => {
  const newValue = { ...storeSelector(STORE_NAMES.VIDEOS_DICTIONARY), ...value }
  storeSetter(STORE_NAMES.VIDEOS_DICTIONARY, true)(newValue)
}
export const setVideos = storeSetter(STORE_NAMES.VIDEOS)
export const setDuration = storeSetter(STORE_NAMES.DURATION)

export const updateAllVideos = ({ videos, videosMap, duration }) => {
  setVideosDictionary(videosMap)
  setVideos({ ...storeSelector(STORE_NAMES.VIDEOS_DICTIONARY), ...videos })
  setDuration(duration)
}

export const addVideo = (video) => {
  const videos = [...storeSelector(STORE_NAMES.VIDEOS), video]
  const videosMap = {
    ...storeSelector(STORE_NAMES.VIDEOS_DICTIONARY),
    [video.composedId]: video,
  }
  const duration = storeSelector(STORE_NAMES.DURATION) + video.durationSeconds
  updateAllVideos({ videos, videosMap, duration })
}

export const removeVideo = (video) => {
  const videos = storeSelector(STORE_NAMES.VIDEOS).filter(
    ({ composedId }) => video.composedId !== composedId
  )
  const duration = storeSelector(STORE_NAMES.DURATION) - video.durationSeconds
  setVideos(videos)
  setDuration(duration)
}
