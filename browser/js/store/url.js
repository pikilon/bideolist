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

export const generateListUrlQuery = ({ videos, title, active = "" }) => {
  const activeParam = active ? `&${URL_PARAMS_STORE.ACTIVE}=${active}` : ""
  return `?${URL_PARAMS_STORE.TITLE}=${title}&${URL_PARAMS_STORE.VIDEOS}=${videos.join(",")}${activeParam}`
}

export const reflectInUrl = (listInfo) => {
  const finalListInfo = { ...getListInfoFromUrl(), ...listInfo }
  const { videos, title, active } = finalListInfo
  window.history.pushState(
    listInfo,
    title,
    generateListUrlQuery(finalListInfo)
  )
}
