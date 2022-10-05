export const STATIC_CACHE_NAME = "static-cache-v1"
export const DEV_CACHE_NAME = "dev-cache-v1"

const STATIC_EXTERNAL_FILES = [
  "https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Roboto:wght@400;900&family=Special+Elite&display=swap",
  "https://fonts.gstatic.com/s/permanentmarker/v10/Fh4uPib9Iyv2ucM6pGQMWimMp004La2Cfw.woff2",
  "https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmYUtfBBc4.woff2",
  "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxK.woff2",
  "https://unpkg.com/@lit/reactive-element@%5E1.3.0?module",
  "https://unpkg.com/@lit/reactive-element@1.3.1/css-tag.js?module",
  "https://unpkg.com/lit-element@%5E3.2.0/lit-element.js?module",
  "https://unpkg.com/lit-html@%5E2.2.0?module",
  "https://unpkg.com/lit-html@%5E2.2.0/directives/class-map.js?module",
  "https://unpkg.com/lit-html@%5E2.2.0/directives/unsafe-svg.js?module",
  "https://unpkg.com/lit-html@2.2.2/directive.js?module",
  "https://unpkg.com/lit-html@2.2.2/directives/unsafe-html.js?module",
  "https://unpkg.com/lit-html@2.2.2/lit-html.js?module",
  "https://unpkg.com/lit/directives/class-map.js?module",
  "https://unpkg.com/lit/directives/if-defined.js?module",
  "https://unpkg.com/lit/directives/unsafe-svg.js?module",
  "https://unpkg.com/lit/index.js?module",
  "https://unpkg.com/react-player@2.11.0/dist/ReactPlayer.standalone.js",
  "https://unpkg.com/react-player@2.11.0/dist/ReactPlayer.standalone.es6.js",
  "https://player.vimeo.com/api/player.js",
  "https://api.dmcdn.net/all.js",
]

export const addResourcesToCache = async (resources, chacheName = STATIC_CACHE_NAME) => {
  const cache = await caches.open(chacheName);
  await cache.addAll(resources);
};

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

export const putInCache = async (
  request,
  response,
  cacheName = DEV_CACHE_NAME
) => {
  const cache = await caches.open(cacheName)
  await cache.put(request, response)
}

export const cacheFirst = async (event) => {
  const isWebsocket = event.request.url.includes("ws:")
  if (isWebsocket) {
    return fetch(event.request)
  }
  const { request, preloadResponse } = event
  const cachedResponse = await caches.match(event.request)
  if (cachedResponse) {
    return cachedResponse
  }
  const preloadedResponse = await preloadResponse
  if (preloadedResponse) {

    putInCache(request, preloadedResponse.clone())
    return preloadedResponse
  }

  try {
    const networkResponse = await fetch(request)
    putInCache(request, networkResponse.clone())
    return networkResponse
  } catch (error) {
    console.log("No se ha podido cargar el recurso", request.url, error)
  }
  return new Response("Network error happened", {
    status: 408,
    headers: { "Content-Type": "text/plain" },
  })
}
