import { html, LitElement } from "lit"
import { getElapsedVideosTime } from "../store/computed.js"
import { getUnsubscribeCurrentVideoElapsedSeconds } from "../store/store.js"
import "./progress-bar.js"

class DurationBar extends LitElement {
  static properties = {
    totalDuration: { type: Number, state: true },
    elapsedVideosTime: { type: Number, state: true },
    currentVideoProgress: { type: Number, state: true },
  }

  constructor() {
    super()
    const unsubscribeElapsedVideosTime = getElapsedVideosTime(
      ({ elapsedTime, totalDuration }) => {
        this.elapsedVideosTime = elapsedTime
        this.totalDuration = totalDuration
      }
    )
    const unsubscribeCurrentVideoElapsedSeconds =
      getUnsubscribeCurrentVideoElapsedSeconds((currentVideoProgress) => {
        this.currentVideoProgress = currentVideoProgress
      })

    this.disconnectedCallback = () => {
      unsubscribeElapsedVideosTime()
      unsubscribeCurrentVideoElapsedSeconds()
    }
  }

  get totalDone() {
    return this.elapsedVideosTime + this.currentVideoProgress
  }

  render() {
    const { totalDuration, totalDone } = this
    return html`<progress-bar
        total=${totalDuration}
        done=${totalDone}
    ></progress-bar>`
  }
}

customElements.define("duration-bar", DurationBar)
