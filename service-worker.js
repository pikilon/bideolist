const SERVICE_WORKERS_EVENTS = {
  INSTALL: 'install',
  ACTIVATE: 'activate',
  FETCH: 'fetch',
}

self.addEventListener(SERVICE_WORKERS_EVENTS.INSTALL, event => {
  console.log('installed', event);
})

// it doesn't activate it on new version automatically
self.addEventListener(SERVICE_WORKERS_EVENTS.ACTIVATE, event => {
  console.log('activated', event);
})

self.addEventListener(SERVICE_WORKERS_EVENTS.FETCH, event => {
  console.log('fetched', event);
})