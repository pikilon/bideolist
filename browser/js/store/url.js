export const URL_PARAMS_STORE = {
  TITLE: "title",
  VIDEOS: "videos",
  ACTIVE: "active",
  ROUTE: "route",
}

export const ROUTES = {
  ROOT: "/",
  ROOT_INDEX: "/index.html",
  LIST: "/list",
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
  return `list?${URL_PARAMS_STORE.TITLE}=${title}&${
    URL_PARAMS_STORE.VIDEOS
  }=${videos.join(",")}${activeParam}`
}

export const reflectListInUrl = (listInfo) => {
  const finalListInfo = { ...getListInfoFromUrl(), ...listInfo }
  const { title } = finalListInfo
  const query = generateListUrlQuery(finalListInfo)
  window.history.pushState(listInfo, title, query)
}

export const reflectRootInUrl = () => window.history.pushState({}, "", "../")


export const getRoute = () => {
  const withoutGithubSubfolder = window.location.pathname.replace(/bideolist\//, "")
  const result = withoutGithubSubfolder.replace(/\/$/, "")
  return result.length > 0 ? result : "/"
}