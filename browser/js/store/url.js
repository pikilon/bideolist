export const URL_PARAMS_STORE = {
  TITLE: "title",
  VIDEOS: "videos",
  ACTIVE: "active",
  ROUTE: "route",
}

export const ROUTES = {
  ROOT: "",
  LIST: "list",
}

export const getAllParamsFromUrl = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const videosString = queryParams.get(URL_PARAMS_STORE.VIDEOS)
  const title = queryParams.get(URL_PARAMS_STORE.TITLE) || "untitled"
  const active = Number(queryParams.get(URL_PARAMS_STORE.ACTIVE)) || 0
  const videos = videosString?.split(",") || []
  const route = queryParams.get(URL_PARAMS_STORE.ROUTE) || ROUTES.ROOT

  return { videos, title, active, route }
}

export const getListInfoFromUrl = () => {
  const { videos, title, active } = getAllParamsFromUrl()

  return { videos, title, active }
}

export const generateListUrlQuery = ({ videos, title, active = "" }) => {
  const activeParam = active ? `&${URL_PARAMS_STORE.ACTIVE}=${active}` : ""
  return `?${URL_PARAMS_STORE.ROUTE}=${ROUTES.LIST}&${
    URL_PARAMS_STORE.TITLE
  }=${title}&${URL_PARAMS_STORE.VIDEOS}=${videos.join(",")}${activeParam}`
}

export const reflectListInUrl = (listInfo) => {
  const finalListInfo = { ...getListInfoFromUrl(), ...listInfo }
  const { title } = finalListInfo
  const query = generateListUrlQuery(finalListInfo)
  window.history.pushState(listInfo, title, query)
}

export const reflectRootInUrl = () => window.history.pushState({}, "", "/")

export const getRoute = () => getAllParamsFromUrl().route
