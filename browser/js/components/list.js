import { html, css, LitElement } from "lit"
import "./video.js"
import {
  filterUnknowVideos,
  getUnsubscribeVideosTotalDuration,
} from "../store/computed.js"
import {
  getUnsubscribeValue,
  STORE_NAMES,
  setVideosDictionary,
} from "../store/store.js"
import { fetchAllVideosFromCompundsIds } from "../api/fetchAllVideos.js"

export class BList extends LitElement {
  static styles = css`
    .video + .video {
      margin-top: var(--gap-small);
    }
  `

  static properties = {
    videos: { type: Array, state: true },
    selectedVideoIndex: { type: Number, state: true },
  }

  constructor() {
    super()
    const unsubscribeActive = getUnsubscribeValue({
      storeName: STORE_NAMES.ACTIVE,
      callback: (active) => (this.selectedVideoIndex = active),
    })

    const unsubscribeVideosInfo = getUnsubscribeVideosTotalDuration(
      ({ videos, compoundIds }) => {
        this.videos = videos

        const unknownVideos = filterUnknowVideos(compoundIds)
        if (!unknownVideos.length) return
        fetchAllVideosFromCompundsIds(unknownVideos).then(setVideosDictionary)
      }
    )

    this.unsubscribeAll = () => {
      unsubscribeActive()
      unsubscribeVideosInfo()
    }
  }
  disconnectedCallback() {
    this.unsubscribeAll()
  }
  setValues = ({ videos }) => {
    this.videos = videos
  }

  render() {
    const { videos, selectedVideoIndex } = this
    if (!videos?.length) return

    return html`
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

customElements.define("bl-list", BList)
