import { emit } from "./bus.js"
import { getListInfoFromUrl, reflectInUrl } from "./url.js"
import { areEqual } from "../utils/areEqual.js"

export const STORE_NAMES = {
  VIDEOS_DICTIONARY: "VIDEOS_DICTIONARY",
  URL: "URL",
}

const localStorageVideosDictionary = localStorage.getItem(
  STORE_NAMES.VIDEOS_DICTIONARY
)
const videosDictionaryFirstValue = localStorageVideosDictionary
  ? JSON.parse(localStorageVideosDictionary)
  : {}

const storeHistory = {
  [STORE_NAMES.VIDEOS_DICTIONARY]: [videosDictionaryFirstValue],
  [STORE_NAMES.URL]: [getListInfoFromUrl()],
}

const persistStorage = (storeName, value) => {
  localStorage.setItem(storeName, JSON.stringify(value))
}

export const storeSelector = (storeName) => {
  const storeSlice = storeHistory[storeName]

  return storeSlice[storeSlice.length - 1]
}

const storeSetter =  // returns if emitted
  (storeName, persist = false) =>
  (value) => {
    const storeSlice = storeHistory[storeName]
    const currentValue = storeSelector(storeName)
    const sameValue = areEqual(currentValue, value)

    if (sameValue) return false
    storeSlice.push(value)
    if (persist) persistStorage(storeName, value)
    console.log("storeHistory", storeName, storeSlice)
    emit(storeName, value)
    return true
  }

export const setVideosDictionary = (value) => {
  const newValue = { ...storeSelector(STORE_NAMES.VIDEOS_DICTIONARY), ...value }
  storeSetter(STORE_NAMES.VIDEOS_DICTIONARY, true)(newValue)
}

export const setUrlParams = (partialListInfo) => {
  const newValue = { ...storeSelector(STORE_NAMES.URL), ...partialListInfo }
  storeSetter(STORE_NAMES.URL, true)(newValue)
  reflectInUrl(newValue)
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
