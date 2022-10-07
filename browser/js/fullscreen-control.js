

export const checkFullscreen = () => Boolean(document.fullscreenElement)

export const turnFullscreen = (fullscreenElement) => (on = !checkFullscreen()) => {
  const isFullscreen = checkFullscreen()
  const exitFullscreenPromise = isFullscreen
    ? document.exitFullscreen()
    : Promise.resolve()
  if (!on) return exitFullscreenPromise
  return fullscreenElement.requestFullscreen()
}

export const subscribeFullscreen = (callback) => {
  const finalCallback = callback
  document.addEventListener("fullscreenchange", finalCallback)
  return () => document.removeEventListener("fullscreenchange", finalCallback)
}
