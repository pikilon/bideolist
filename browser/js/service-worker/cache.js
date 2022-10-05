export const STATIC_CACHE_NAME = "static-cache-v1"
export const DEV_CACHE_NAME = "dev-cache-v1"
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

export const compareFetchAndCache = async (cachedFile, request) => {
  const cache = await caches.open(DEV_CACHE_NAME)
  console.log("cache dev", cache)
  if (!cachedFile) cache.put(request, fetch(request))
}

export const resolveResource = async (event) => {
  console.log("event.request.url", event.request.url)
  if (event.request.url.includes("player-controls.js")) {
    console.log("event.request", event.request)
  }
  const chachedFile = await caches.match(event.request)

  const finalContent = chachedFile || (await fetch(event.request))
  // fire and forget to update the cache later
  compareFetchAndCache(chachedFile, event.request)
  return finalContent
}

const putInCache = async (request, response, cacheName = DEV_CACHE_NAME) => {
  const cache = await caches.open(cacheName)
  await cache.put(request, response)
}

const putFetchInCache = async (request, cacheName = DEV_CACHE_NAME) => {
  const response = await fetch(request)
  putInCache(request, response.clone(), cacheName)
  return response
}

export const cacheFirst = async (event) => {
  const isWebsocket = event.request.url.includes("ws:")
  if (isWebsocket) {
    return fetch(event.request)
  }
  const { request, preloadResponse } = event
  const cachedResponse = await caches.match(event.request)
  if (cachedResponse) {
    // putFetchInCache(request)
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
