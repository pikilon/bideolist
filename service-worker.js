import { swFetch } from "./browser/js/service-worker/fetch.js"
import { swInstall } from "./browser/js/service-worker/install.js"
import { swPush } from "./browser/js/service-worker/push.js"

const SERVICE_WORKERS_EVENTS = {
  INSTALL: "install",
  ACTIVATE: "activate",
  FETCH: "fetch",
  MESSAGE: "message",
  PUSH: "push",
}

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener(SERVICE_WORKERS_EVENTS.INSTALL, swInstall)

// it doesn't activate it on new version automatically
self.addEventListener(SERVICE_WORKERS_EVENTS.ACTIVATE, (event) => {
  event.waitUntil(enableNavigationPreload());
  // console.log('activated', event);
})

self.addEventListener(SERVICE_WORKERS_EVENTS.FETCH, swFetch)
self.addEventListener(SERVICE_WORKERS_EVENTS.PUSH, swPush)

