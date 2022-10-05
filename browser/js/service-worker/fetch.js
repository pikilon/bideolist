import { cacheFirst, compareFetchAndCache, resolveResource } from "./cache.js"

const staticNotFetched = {
  local: new Set(),
  remote: new Set(),
}
let debounceTimeout = null

const logNotCachedElements = (url) => {
  const isRemote = !url.includes("/browser/")
  clearTimeout(debounceTimeout)
  const targetLibrary = isRemote
    ? staticNotFetched.remote
    : staticNotFetched.local
  targetLibrary.add(url)
  debounceTimeout = setTimeout(() => {
    console.log("Not cached", staticNotFetched)
  }, 3000)
}
export const STATIC_CACHE_NAME = "static-cache-v1"
export const DEV_CACHE_NAME = "dev-cache-v1"

export const swFetch = (event) => {
  event.respondWith(cacheFirst(event))
}
