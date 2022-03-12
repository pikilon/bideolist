import { SOURCES } from "../constants.js"
import { fetchNewVideos } from "../store/store.js"

const API_SEARCH_URL =
  "https://us-central1-bideolist-44181.cloudfunctions.net/search?query="

const getComposedIds = (html) => {
  const regex =
    /(dailymotion|youtube|vimeo).com\/(video\/|watch%3Fv%3D)?([^&]+)&amp/gim
  const composedIdsMap = {}
  let match

  while ((match = regex.exec(html)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === regex.lastIndex) regex.lastIndex++

    const sourceSite = match[1].toUpperCase()
    const id = match[3]
    const source = SOURCES[sourceSite]
    const wrongMatch = !id || !source
    const sourceId = source?.ID
    if (wrongMatch) continue
    const composedId = `${sourceId}:${id}`
    composedIdsMap[composedId] = composedId
  }
  return Object.keys(composedIdsMap)
}

export const search = async (query) => {
  const url = `${API_SEARCH_URL}${encodeURI(query)}`
  const { html } = await fetch(url, { mode: "cors" }).then((res) => res.json())
  const composedIds = getComposedIds(html)
  const videos = await fetchNewVideos(composedIds)
  return videos
}
