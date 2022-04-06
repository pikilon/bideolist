import ASSETS from "./generated-assets-list-module.js"
const SERVICE_WORKERS_EVENTS = {
  INSTALL: 'install',
  ACTIVATE: 'activate',
  FETCH: 'fetch',
  MESSAGE: 'message',
}
const STATIC_CACHE_NAME = 'static-cache-v1';

self.addEventListener(SERVICE_WORKERS_EVENTS.INSTALL, async (event) => {
  const cache = caches.open(STATIC_CACHE_NAME);
  cache.then(cache => {
    cache.addAll(ASSETS)
  })
})

// it doesn't activate it on new version automatically
self.addEventListener(SERVICE_WORKERS_EVENTS.ACTIVATE, async (event) => {
  // console.log('activated', event);
})

self.addEventListener(SERVICE_WORKERS_EVENTS.FETCH, event => {
  // console.log('fetched', event);
})