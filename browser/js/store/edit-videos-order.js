import {
  STORE_NAMES,
  storeSelector,
  setUrlParameters,
  setActive,
} from "./store.js"

export const addVideo = (composedId, index = 0) => {
  const newVideos = [...storeSelector(STORE_NAMES.VIDEOS)]
  const currentActive = storeSelector(STORE_NAMES.ACTIVE)

  newVideos.splice(index, 0, composedId)
  setUrlParameters(STORE_NAMES.VIDEOS)(newVideos)
  if (index > currentActive) return

  setActive(currentActive + 1)
}

export const removeVideo = (videoIndex) => {
  const newVideos = [...storeSelector(STORE_NAMES.VIDEOS)]
  const currentActive = storeSelector(STORE_NAMES.ACTIVE)

  newVideos.splice(videoIndex, 1)
  setUrlParameters(STORE_NAMES.VIDEOS)(newVideos)
  if (videoIndex > currentActive) return

  setActive(currentActive - 1)
}

export const moveVideo = (oldIndex, newIndex) => {
  const newVideos = [...storeSelector(STORE_NAMES.VIDEOS)]
  const activeVideo = storeSelector(STORE_NAMES.ACTIVE)
  const composedId = newVideos.splice(oldIndex, 1)
  const isLater = newIndex > oldIndex
  const doesntAffectActive =
    (oldIndex > activeVideo && newIndex > activeVideo) ||
    (oldIndex < activeVideo && newIndex < activeVideo)
  const targetNewIndex = isLater ? newIndex - 1 : newIndex

  newVideos.splice(targetNewIndex, 0, composedId)
  setUrlParameters(STORE_NAMES.VIDEOS)(newVideos)
  if (doesntAffectActive) return

  const movingActive = activeVideo === oldIndex
  if (movingActive) return setActive(targetNewIndex)

  const newActive = oldIndex > activeVideo ? activeVideo + 1 : activeVideo - 1
  setActive(newActive)
}
