import { emit, subscribe } from "./bus.js"
import { getListInfoFromUrl, reflectInUrl, URL_PARAMS_STORE } from "./url.js"
import { areEqual } from "../utils/areEqual.js"

export const STORE_NAMES = {
  VIDEOS_DICTIONARY: "VIDEOS_DICTIONARY",
  CURRENT_VIDEO_ELAPSED_SECONDS: "CURRENT_VIDEO_ELAPSED_SECONDS",
  ...URL_PARAMS_STORE,
}

const localStorageVideosDictionary = localStorage.getItem(
  STORE_NAMES.VIDEOS_DICTIONARY
)
const videosDictionaryFirstValue = localStorageVideosDictionary
  ? JSON.parse(localStorageVideosDictionary)
  : {}

const { videos, title, active } = getListInfoFromUrl()

// No historic store
const store = {
  [STORE_NAMES.CURRENT_VIDEO_ELAPSED_SECONDS]: 0,
}

const storeHistory = {
  [STORE_NAMES.VIDEOS_DICTIONARY]: [videosDictionaryFirstValue],
  [STORE_NAMES.VIDEOS]: [videos],
  [STORE_NAMES.TITLE]: [title],
  [STORE_NAMES.ACTIVE]: [active],
}

const persistStorage = (storeName, value) => {
  localStorage.setItem(storeName, JSON.stringify(value))
}

export const storeSelector = (storeName) => {
  const storeSlice = storeHistory[storeName]

  return storeSlice[storeSlice.length - 1]
}

export const setCurrentVideoElapsedSeconds = (seconds) => {
  const storeName = STORE_NAMES.CURRENT_VIDEO_ELAPSED_SECONDS
  const currentValue = store[storeName]
  const sameValue = areEqual(currentValue, seconds)
  if (sameValue) return
  store[storeName] = seconds
  emit(storeName, seconds)
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

export const getUnsubscribeValue = ({
  storeName,
  callback,
  noHistory = false,
}) => {
  const callbackWrapper = () =>
    callback(noHistory ? store[storeName] : storeSelector(storeName))
  callbackWrapper()
  return subscribe(storeName, callbackWrapper)
}

export const getUnsubscribeCurrentVideoElapsedSeconds = (callback) =>
  getUnsubscribeValue({
    storeName: STORE_NAMES.CURRENT_VIDEO_ELAPSED_SECONDS,
    callback,
    noHistory: true,
  })

const setUrlParameters = (storeUrlName) => (value) => {
  storeSetter(storeUrlName)(value)
  reflectInUrl({ [storeUrlName]: value })
}

export const setActive = (value) => {
  const isSameIndex = areEqual(storeSelector(STORE_NAMES.ACTIVE), value)
  if (isSameIndex) return
  setUrlParameters(STORE_NAMES.ACTIVE)(value)
  setCurrentVideoElapsedSeconds(0);
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
