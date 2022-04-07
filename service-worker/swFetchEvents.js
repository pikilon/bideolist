const staticNotFetched = {
  local: new Set(),
  remote: new Set(),
}
let debounceTimeout = null

const logNotCachedElements = (url) => {
  const isRemote = !url.includes('/browser/')
  clearTimeout(debounceTimeout)
  const targetLibrary = isRemote
    ? staticNotFetched.remote
    : staticNotFetched.local
  targetLibrary.add(url)
  debounceTimeout = setTimeout(() => {
    console.log("staticNotFetched", staticNotFetched)
  }, 3000)
}

export const swFetchEvents = (event) => {
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      if (!cacheResponse) logNotCachedElements(event.request.url)
      return cacheResponse || fetch(event.request)
    })
  )
}
