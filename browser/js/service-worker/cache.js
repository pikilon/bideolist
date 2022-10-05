export const STATIC_CACHE_NAME = "static-cache-v1"
export const DEV_CACHE_NAME = "dev-cache-v1"
export const DYNAMIC_EXTERNAL_CACHE = "dynamic-external-cache"
import { STATIC_EXTERNAL_FILES } from "./cache-static-list.js"

export const addResourcesToCache = async (
  resources,
  chacheName = STATIC_CACHE_NAME
) => {
  const cache = await caches.open(chacheName)
  await cache.addAll(resources)
}

export const initializeStaticCache = async () => {
  await addResourcesToCache(STATIC_EXTERNAL_FILES, STATIC_CACHE_NAME)
}



const putInCache = async (request, response, cacheName = DEV_CACHE_NAME) => {
  const cache = await caches.open(cacheName)
  await cache.put(request, response)
}

const putFetchInCache = async (request) => {
  const { url } = request
  const isLocal = isLocalUrl(url)
  const isIndexRoute = indexRoute(url)
  const cacheName = isLocal ? DEV_CACHE_NAME : DYNAMIC_EXTERNAL_CACHE
  const finalRequest = isIndexRoute ? "index.html" : request

  try {
    const response = await fetch(finalRequest)

    if (response.type !== "opaque")
      putInCache(finalRequest, response.clone(), cacheName)
    return response
  } catch (error) {
    return new Response("Error fetching resource", error)
  }
}

const isLocalUrl = (url) => url.startsWith(location.origin)
const indexRoute = (url) => url.includes("?route=")

export const cacheFirst = async (event) => {
  const { request, preloadResponse } = event
  const { url } = request
  const isIndexRoute = indexRoute(url)
  const finalCacheMatch = isIndexRoute ? location.origin : request

  const isWebsocket = url.includes("ws:")
  if (isWebsocket) {
    return fetch(request)
  }

  const cachedResponse = await caches.match(finalCacheMatch)
  if (cachedResponse) {
    putFetchInCache(request)
    return cachedResponse
  }
  const preloadedResponse = await preloadResponse
  if (preloadedResponse) {
    putInCache(request, preloadedResponse.clone())
    return preloadedResponse
  }

  try {
    return putFetchInCache(request)
  } catch (error) {
    console.log("No se ha podido cargar el recurso", request.url, error)
  }
  return new Response("Network error happened", {
    status: 408,
    headers: { "Content-Type": "text/plain" },
  })
}
