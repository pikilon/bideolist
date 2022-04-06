const SERVICE_WORKERS_EVENTS = {
  INSTALL: 'install',
  ACTIVATE: 'activate',
  FETCH: 'fetch',
  MESSAGE: 'message',
}
const STATIC_CACHE_NAME = 'static-cache-v1';

self.addEventListener(SERVICE_WORKERS_EVENTS.INSTALL, async (event) => {
  // const clients = await self.clients.matchAll()
  // console.log('clients.length', clients.length);
  // for (const client of clients) client.postMessage({ msg: "installed" });

})

// it doesn't activate it on new version automatically
self.addEventListener(SERVICE_WORKERS_EVENTS.ACTIVATE, async (event) => {
  console.log('event', event);
  if (!event.clientId) return;
  const client = await clients.get(event.clientId);
  client.postMessage({ msg: "activated" });
  // console.log('activated', event);
})

self.addEventListener(SERVICE_WORKERS_EVENTS.FETCH, event => {
  // console.log('fetched', event);
})

self.addEventListener(SERVICE_WORKERS_EVENTS.MESSAGE, ({ data: { type, payload } }) => {
  if (type === "ASSET_PATHS") {
    const cache = caches.open(STATIC_CACHE_NAME);
    cache.then(cache => {
      cache.addAll(payload)
    })
  }
})