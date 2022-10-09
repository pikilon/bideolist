import { emit, subscribe } from "./bus.js"
import {
  getListInfoFromUrl,
  reflectListInUrl,
  URL_PARAMS_STORE,
  ROUTES,
  getRoute,
  reflectRootInUrl,
} from "./url.js"
import { areEqual } from "../utils/areEqual.js"
import { fetchAllVideosFromCompundsIds } from "../api/fetchAllVideos.js"
import { DEMO_LIST } from "../constants.js"
import { addBideosDB, getBideosMapDB } from "../db.js"

export const STORE_NAMES = {
  CURRENT_VIDEO_ELAPSED_SECONDS: "CURRENT_VIDEO_ELAPSED_SECONDS",
  LISTS: "LISTS",
  PLAYING: "PLAYING",
  ...URL_PARAMS_STORE,
}

// TODO: move this to db 
const localListStorage = localStorage.getItem(STORE_NAMES.LISTS) || "{}"

const initialLists = {
  ...JSON.parse(localListStorage),
  [DEMO_LIST.title]: DEMO_LIST,
}

const { videos, title, active } = getListInfoFromUrl()

// No historic store
const store = {
  [STORE_NAMES.CURRENT_VIDEO_ELAPSED_SECONDS]: 0,
}

const storeHistory = {
  [STORE_NAMES.VIDEOS]: [videos],
  [STORE_NAMES.TITLE]: [title],
  [STORE_NAMES.ACTIVE]: [active],
  [STORE_NAMES.LISTS]: [initialLists],
  [STORE_NAMES.PLAYING]: [true],
  [STORE_NAMES.ROUTE]: [getRoute()],
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
const storeSetter = // returns if emitted

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

export const upsertList = (list) => {
  const newValue = {
    ...storeSelector(STORE_NAMES.LISTS),
    [list.title]: list,
  }
  storeSetter(STORE_NAMES.LISTS, true)(newValue)
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

export const setUrlParameters = (storeUrlName) => (value) => {
  storeSetter(storeUrlName)(value)
  reflectListInUrl({ [storeUrlName]: value })
}

export const setListTitle = (title) => {
  setUrlParameters(STORE_NAMES.TITLE)(title)
}

export const setActive = (newIndex, resetCurrentElapsedTime = false) => {
  const isSameIndex = areEqual(storeSelector(STORE_NAMES.ACTIVE), newIndex)
  if (isSameIndex) return
  setUrlParameters(STORE_NAMES.ACTIVE)(newIndex)
  if (!resetCurrentElapsedTime) setCurrentVideoElapsedSeconds(0)
}

export const setNextPrevActive =
  (prev = false) =>
  () => {
    const currentActive = storeSelector(STORE_NAMES.ACTIVE)
    let newActive = prev ? currentActive - 1 : currentActive + 1
    if (newActive < 0) newActive = 0
    const videosLength = storeSelector(STORE_NAMES.VIDEOS).length
    if (newActive >= videosLength) newActive = videosLength - 1
    setActive(newActive, true)
  }

// TODO: move this to service-worker
export const fetchNewVideos = async (composedIds) => {
  const videosMap = await getBideosMapDB(composedIds)
  const unkownVideos = composedIds.filter(
    (composedId) => !videosMap[composedId]
  )

  const newVideosMap = await fetchAllVideosFromCompundsIds(unkownVideos)
  const newVideosArray = []
  const videos = []
  for (let composedId of composedIds) {
    const newVideo = newVideosMap[composedId]
    const video = videosMap[composedId] || newVideo

    if (newVideo) newVideosArray.push(newVideo)
    if (video) videos.push(video)
  }
  addBideosDB(newVideosArray)
  return videos
}

export const handleSetPlaying = (playing) => () =>
  storeSetter(STORE_NAMES.PLAYING)(playing)

export const navigateToList = (list) => {
  const { title, videos } = list
  storeSetter(STORE_NAMES.TITLE)(title)
  storeSetter(STORE_NAMES.VIDEOS)(videos)
  storeSetter(STORE_NAMES.ACTIVE)(0)
  reflectListInUrl({ [STORE_NAMES.TITLE]: title, [STORE_NAMES.VIDEOS]: videos })
  storeSetter(STORE_NAMES.PLAYING)(true)
  storeSetter(STORE_NAMES.ROUTE)(ROUTES.LIST)
}

export const navigateToRoot = (event) => {
  event.preventDefault()
  storeSetter(STORE_NAMES.ROUTE)(ROUTES.ROOT)
  storeSetter(STORE_NAMES.PLAYING)(false)
  reflectRootInUrl()
}
