import { html, css, LitElement } from "lit"
import "./video.js"
import { subscribeVideosDuration } from "../store/computed.js"
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
    const [videosSelectedVideoIndex, unsubscribeVideosIndex] =
      subscribeVideosDuration(this.setValues)
    this.setValues(videosSelectedVideoIndex)
    this.unsubscribeVideosIndex = unsubscribeVideosIndex
  }
  disconnectedCallback() {
    this.unsubscribeVideosIndex()
  }
  setValues = ({ videos, active }) => {
    this.videos = videos
    this.selectedVideoIndex = active
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
