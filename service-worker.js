const SERVICE_WORKERS_EVENTS = {
  INSTALL: 'install',
  ACTIVATE: 'activate',
  FETCH: 'fetch',
}
const STATIC_CACHE_NAME = 'static-cache-v1';
// This assets are injected HERE using `node node-scripts/injectAssetsListInSWFile.js`
const ASSETS = ["index.html","list/index.html","browser/css/body.css","browser/css/normalize.css","browser/css/utility-classes.css.js","browser/css/variables.css","browser/images/background.png","browser/images/bideolist_logo.avif","browser/js/app.js","browser/js/constants.js","browser/images/favicons/favicon.png","browser/images/favicons/icon-192x192.png","browser/images/favicons/icon-256x256.png","browser/images/favicons/icon-384x384.png","browser/images/favicons/icon-512x512.png","browser/images/icons/backward-step.svg","browser/images/icons/circle.svg","browser/images/icons/dailymotion.svg","browser/images/icons/floppy-disk.svg","browser/images/icons/forward-step.svg","browser/images/icons/grip-vertical.svg","browser/images/icons/magnifying-glass.svg","browser/images/icons/pause.svg","browser/images/icons/pen.svg","browser/images/icons/play.svg","browser/images/icons/repeat.svg","browser/images/icons/spinner.svg","browser/images/icons/trash-can.svg","browser/images/icons/vimeo.svg","browser/images/icons/youtube.svg","browser/js/api/fetchAllVideos.js","browser/js/api/search.js","browser/js/components/async-icon.js","browser/js/components/bl-search.js","browser/js/components/create-list.js","browser/js/components/home.js","browser/js/components/label.js","browser/js/components/list-page.js","browser/js/components/list-title.js","browser/js/components/list.js","browser/js/components/loading-spinner.js","browser/js/components/player-button.js","browser/js/components/player-controls.js","browser/js/components/player.js","browser/js/components/progress-bar.js","browser/js/components/search-videos.js","browser/js/components/source-icon.js","browser/js/components/video.js","browser/js/sources/dailymotion.js","browser/js/sources/vimeo.js","browser/js/sources/youtube.js","browser/js/store/bus.js","browser/js/store/computed.js","browser/js/store/edit-videos-order.js","browser/js/store/store.js","browser/js/store/url.js","browser/js/utils/areEqual.js","browser/js/utils/loadScript.js","browser/js/utils/secondsToDuration.js","browser/js/utils/splitArrayEach.js"]

self.addEventListener(SERVICE_WORKERS_EVENTS.INSTALL, async (event) => {
  const cache = await caches.open(STATIC_CACHE_NAME);
  await cache.addAll(ASSETS)
})

// it doesn't activate it on new version automatically
self.addEventListener(SERVICE_WORKERS_EVENTS.ACTIVATE, event => {
  console.log('activated', event);
})

self.addEventListener(SERVICE_WORKERS_EVENTS.FETCH, event => {
  console.log('fetched', event);
})