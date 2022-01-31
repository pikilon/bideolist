import { html, css, LitElement } from "lit"
import { fetchAllVideosFromString } from "./api/fetchAllVideos.js"
import { secondsToDuration } from "./secondsToDuration.js"
import "./components/video.js"
import { updateAllVideos, STORE_NAMES, storeSelector } from "./store/store.js"
import { subscribe } from "./store/bus.js"

const getListInfoFromUrl = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const videosString = queryParams.get("videos")
  const compoundIds = videosString?.split(",") || []
  return { compoundIds }
}
export class MainWrapper extends LitElement {
  static styles = css`
    p {
      color: "blue";
    }
  `

  static properties = {
    compoundIds: { type: Array, state: true },
    videos: { type: Array, state: true },
    duration: { type: Number, state: true },
    formattedDuration: { type: String, state: true },
  }

  constructor() {
    super()
    this.getVideosInfo()

    window.addEventListener("locationchange", () => {
      this.getVideosInfo()
    })

    fetchAllVideosFromString(this.compoundIds).then((videosInfo) => {
      updateAllVideos(videosInfo)
    })
    this.unsubscribeVideosMap = subscribe(
      STORE_NAMES.VIDEOS_DICTIONARY,
      this.getVideosInfo
    )
  }
  disconnectedCallback() {
    this.unsubscribeVideosMap()
  }

  getVideosInfo = () => {
    const { compoundIds } = getListInfoFromUrl()
    const videosMap = storeSelector(STORE_NAMES.VIDEOS_DICTIONARY)
    let duration = 0
    let videos = []
    const weHaveVideoInfo = Object.keys(videosMap).length
    if (weHaveVideoInfo) {
      for (const id of compoundIds) {
        const video = videosMap[id]
        if (!video) continue
        videos.push(video)
        duration += video?.durationSeconds || 0
      }
    }

    this.compoundIds = compoundIds
    this.videos = videos
    this.duration = duration
    this.formattedDuration = secondsToDuration(duration) || "00:00:00"
  }

  render() {
    const { formattedDuration, videos } = this
    if (!videos?.length) return

    return html`
      <p>Bideolist! ${formattedDuration}</p>
      ${videos.map(
        (video) => html`<bl-video video=${JSON.stringify(video)}></bl-video>`
      )}
    `
  }
}

customElements.define("bl-main", MainWrapper)
