export const getListInfoFromUrl = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const videosString = queryParams.get("videos")
  const listName = queryParams.get("name") || "untitled"
  const activeVideo = Number(queryParams.get("active")) || 0
  const compoundIds = videosString?.split(",") || []
  return { compoundIds, listName, activeVideo }
}

export const reflectInUrl = (listInfo) => {
  const { compoundIds, listName, activeVideo } = listInfo
  window.history.pushState(
    listInfo,
    listName,
    `?videos=${compoundIds.join(",")}&name=${listName}&active=${activeVideo}`
  )
}
