import { SOURCES, SOURCES_BY_ID } from "../constants.js"
import { dailymotionFetchVideos } from "../sources/dailymotion.js"
import { sortVideosBySource } from "./fetchAllVideos.js"

const THUMBNAILS_URLS = {
  [SOURCES.YOUTUBE.ID]: (id) => `https://img.youtube.com/vi/${id}/1.jpg`,
  [SOURCES.VIMEO.ID]: (id) => `https://vumbnail.com/${id}_medium.jpg`,
}

const generateSearchUrl = (source, ids) =>
  `https://www.google.com/search?tbm=vid&hl=en&q=${ids.join("+OR+")}+site:${
    SOURCES_BY_ID[source].SITE
  }`

const getDurationInSeconds = (colonSeparatedDuration) => {
  const durationArray = colonSeparatedDuration.split(":")
  let durationSeconds = 0

  for (let i = 0; i < durationArray.length && i < 3; i++) {
    const currentMultiplier =
      i === 2 ? 1 : Math.pow(60, durationArray.length - 1 - i)
    const currentDuration = Number(durationArray[i]) * currentMultiplier
    durationSeconds += currentDuration
  }
  return durationSeconds
}

const DURATION_SELECTOR = "[aria-label][role='presentation']"

const videosParser = (parsedHtmlResults, url) => {
  const hrefHeader = `a[href='${url}'][data-ved]`
  const headerTag = parsedHtmlResults.querySelector(hrefHeader)
  if (!headerTag) {
    debugger;
    return {}
  }
  const card = headerTag.parentElement.parentElement
  const durationString = card.querySelector(DURATION_SELECTOR).innerText || ""
  const durationSeconds = getDurationInSeconds(durationString)
  const title = headerTag.querySelector("h3").innerText
  const video = {
    title,
    durationSeconds,
    durationString,
  }
  return video
}

const scrapSearchResults = async (source, ids) => {
  const searchUrl = generateSearchUrl(source, ids)

  const html = await fetch(searchUrl).then((res) => res.text())
  const parser = new DOMParser()
  const parsedHtmlResults = parser.parseFromString(html, "text/html")
  const videosMap = {}
  for (const id of ids) {
    const url = `${SOURCES_BY_ID[source].VIDEO_URL}${id}`
    const componsedId = `${source}:${id}`
    const video = videosParser(parsedHtmlResults, url)
    const thumbUrl = THUMBNAILS_URLS?.[source](id) || ""

    videosMap[componsedId] = {
      id,
      url,
      thumbUrl,
      componsedId,
      source,
      ...video,
    }
  }
  return videosMap
}

export const scrapAllVideosFromCompundsIds = async (compoundIds) => {
  const sortedBySource = sortVideosBySource(compoundIds)
  let videosMap = {}
  for (const source in sortedBySource) {
    const ids = sortedBySource[source]

    if (source === SOURCES.DAILYMOTION.ID) {
      const dailymotionVideos = await dailymotionFetchVideos(ids)
      for (const dmVideo of dailymotionVideos) {
        videosMap[dmVideo.componsedId] = dmVideo
      }
      continue
    }
    const currentVideosMap = await scrapSearchResults(source, ids)
    videosMap = { ...videosMap, ...currentVideosMap }
  }
  return videosMap
}
