import { html, css, LitElement } from "lit"
import { getUnsubscribeVideosDuration } from "../store/computed.js"
import { getUnsubscribeValue, STORE_NAMES } from "../store/store.js"
import { secondsToDuration } from "../utils/secondsToDuration.js"
import "./label.js"

export class SourceIcon extends LitElement {
  static properties = {
    title: { type: String, state: true },
    duration: { type: Number, state: true },
  }
  static styles = css`
    .list-title {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-dark);
      padding: var(--gap-medium);
    }
  `
  setTitleDuration = ({ title, duration }) => {
    this.title = title
    this.duration = duration
  }
  constructor() {
    super()
    const unsubscribeVideos = getUnsubscribeVideosDuration(({ duration }) => {
      this.duration = duration
    })
    const unsubscribeTitle = getUnsubscribeValue({
      storeName: STORE_NAMES.TITLE,
      callback: (title) => (this.title = title),
    })

    this.unsubscribeAll = () => {
      unsubscribeVideos()
      unsubscribeTitle()
    }
  }

  disconnectedCallback() {
    this.unsubscribeAll()
  }
  render() {
    const { title = "untitled", duration = 0 } = this
    return html`
      <div class="list-title">
        <bl-label>
          <h1>${title}</h1>
          <h2>${secondsToDuration(duration)}</h2>
        </bl-label>
      </div>
    `
  }
}

customElements.define("bl-list-title", SourceIcon)
