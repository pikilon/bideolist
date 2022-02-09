import { html, css, LitElement } from "lit"
import { fetchAllVideosFromCompundsIds } from "../api/fetchAllVideos.js"
import { secondsToDuration } from "../secondsToDuration.js"
import "./video.js"
import {
  setVideosDictionary,
  STORE_NAMES,
  storeSelector,
} from "../store/store.js"
import { subscribe } from "../store/bus.js"

const getListInfoFromUrl = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const videosString = queryParams.get("videos")
  const compoundIds = videosString?.split(",") || []
  return { compoundIds }
}
export class MainWrapper extends LitElement {
  static styles = css`
    .video + .video {
      margin-top: var(--gap-small);
    }
  `

  static properties = {
    compoundIds: { type: Array, state: true },
    videos: { type: Array, state: true },
    duration: { type: Number, state: true },
    formattedDuration: { type: String, state: true },
    selectedVideoIndex: { type: Number, state: true },
  }

  constructor() {
    super()
    this.getListUrlParams()
    this.getVideosInfo()

    fetchAllVideosFromCompundsIds(this.compoundIds).then(setVideosDictionary)

    this.unsubscribeUrlParams = subscribe(
      STORE_NAMES.URL,
      this.getListUrlParams
    )

    this.unsubscribeVideosMap = subscribe(
      STORE_NAMES.VIDEOS_DICTIONARY,
      this.getVideosInfo
    )
  }
  disconnectedCallback() {
    this.unsubscribeUrlParams()
    this.unsubscribeVideosMap()
  }

  getListUrlParams = () => {
    const { compoundIds, activeVideo } = storeSelector(STORE_NAMES.URL)
    this.compoundIds = compoundIds
    this.selectedVideoIndex = activeVideo
  }

  getVideosInfo = () => {
    const videosMap = storeSelector(STORE_NAMES.VIDEOS_DICTIONARY)
    let duration = 0
    let videos = []
    const weHaveVideoInfo = Object.keys(videosMap).length
    if (weHaveVideoInfo) {
      for (const id of this.compoundIds) {
        const video = videosMap[id]
        if (!video) continue
        videos.push(video)
        duration += video?.durationSeconds || 0
      }
    }

    this.videos = videos
    this.duration = duration
    this.formattedDuration = secondsToDuration(duration) || "00:00:00"
  }

  render() {
    const { formattedDuration, videos, selectedVideoIndex } = this
    if (!videos?.length) return

    return html`
      <p>Bideolist! ${formattedDuration}</p>

      ${videos.map(
        (video, index) => html`
          <div class="video">
            <bl-video
              video=${JSON.stringify(video)}
              ?active="${index === selectedVideoIndex}"
              index="${index}"
            ></bl-video>
          </div>
        `
      )}
    `
  }
}

customElements.define("bl-main", MainWrapper)
