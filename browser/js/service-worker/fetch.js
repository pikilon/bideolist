import { cacheFirst } from "./cache.js"

export const STATIC_CACHE_NAME = "static-cache-v1"
export const DEV_CACHE_NAME = "dev-cache-v1"

let called = false

export const swFetch = (event) => {
  event.respondWith(cacheFirst(event))
}
