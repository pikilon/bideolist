import { html, css, LitElement } from "lit"
import { getUnsubscribeVideosTotalDuration } from "../store/computed.js"
import {
  STORE_NAMES,
  getUnsubscribeValue,
  getUnsubscribeCurrentVideoElapsedSeconds,
} from "../store/store.js"

class ProgressBar extends LitElement {
  static properties = {
    totalDuration: { type: Number, state: true },
    videos: { type: Array, state: true },
    videosEnds: { type: Array, state: true },
    activeVideo: { type: Number, state: true },
    currentVideoProgress: { type: Number, state: true },
  }
  static styles = css`
    .background {
      height: var(--gap-small);
      background-color: var(--color-dark-gray);
    }
    .progress {
      height: 100%;
      width: var(--progress-bar-width);
      background-color: var(--color-primary);
    }
  `
  constructor() {
    super()
    this.totalDuration = 100
    this.videosEnds = []
    this.activeVideo = 0
    this.currentVideoProgress = 0

    const unsubscribeActive = getUnsubscribeValue({
      storeName: STORE_NAMES.ACTIVE,
      callback: (active) => (this.activeVideo = active),
    })

    const unsubscribeElapsedSeconds = getUnsubscribeCurrentVideoElapsedSeconds(
      (currentVideoProgress) =>
        (this.currentVideoProgress = currentVideoProgress)
    )

    const unsubscribeVideosTotalDuration = getUnsubscribeVideosTotalDuration(
      ({ videos, totalDuration, videosEnds }) => {
        this.videos = videos
        this.totalDuration = totalDuration
        this.videosEnds = videosEnds
      }
    )
    this.disconnectedCallback = () => {
      unsubscribeVideosTotalDuration()
      unsubscribeActive()
      unsubscribeElapsedSeconds()
    }
  }

  getPercentage(durationSeconds) {
    const percentage = (durationSeconds / this.totalDuration) * 100
    const percentageFixed = percentage.toFixed(2)
    return percentageFixed
  }

  get previousVideosLength() {
    const previousVideoIndex = this.activeVideo - 1
    return this.videosEnds[previousVideoIndex] || 0
  }

  get totalProgressPercentage() {
    return this.getPercentage(this.previousVideosLength + this.currentVideoProgress)
  }

  render() {
    return html`
      <div class="background">
        <div
          class="progress"
          style="--progress-bar-width: ${this.totalProgressPercentage}%;"
        ></div>
      </div>
    `
  }
}

customElements.define("progress-bar", ProgressBar)
