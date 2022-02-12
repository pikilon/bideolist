import { html, css, LitElement } from "lit"
import "./video.js"
import { getUnsubscribeVideosDuration } from "../store/computed.js"
import { getUnsubscribeValue, STORE_NAMES } from "../store/store.js"
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
    const [unsubscribeActive] = getUnsubscribeValue({
      storeName: STORE_NAMES.ACTIVE,
      callback: (active) => (this.selectedVideoIndex = active),
    })

    const unsubscribeVideos = getUnsubscribeVideosDuration(({ videos }) => {
      this.videos = videos
    })

    this.unsubscribeAll = () => {
      unsubscribeActive()
      unsubscribeVideos()
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
