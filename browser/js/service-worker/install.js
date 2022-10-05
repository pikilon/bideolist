import { initializeStaticCache } from "./cache.js";

export const swInstall = (event) => {
  event.waitUntil(initializeStaticCache());
}