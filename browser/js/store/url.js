export const URL_PARAMS_STORE = {
  TITLE: "title",
  VIDEOS: "videos",
  ACTIVE: "active",
}

export const getListInfoFromUrl = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const videosString = queryParams.get(URL_PARAMS_STORE.VIDEOS)
  const title = queryParams.get(URL_PARAMS_STORE.TITLE) || "untitled"
  const active = Number(queryParams.get(URL_PARAMS_STORE.ACTIVE)) || 0
  const videos = videosString?.split(",") || []
  return { videos, title, active }
}

export const reflectInUrl = (listInfo) => {
  const finalListInfo = { ...getListInfoFromUrl(), ...listInfo }
  const { videos, title, active } = finalListInfo
  window.history.pushState(
    listInfo,
    title,
    `?videos=${videos.join(",")}&title=${title}&active=${active}`
  )
}
