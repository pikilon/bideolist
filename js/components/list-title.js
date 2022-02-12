import { html, css, LitElement } from "lit"
import { getUnsubscribeVideosDuration } from "../store/computed.js"
import { getUnsubscribeValue, STORE_NAMES } from "../store/store.js"
import { secondsToDuration } from "../utils/secondsToDuration.js"

export class SourceIcon extends LitElement {
  static properties = {
    title: { type: String, state: true },
    duration: { type: Number, state: true },
  }
  static styles = css`
    .list-title {
      background-color: var(--color-light);
      color: var(--color-dark);
      padding: var(--gap-medium);
    }
    h1,
    h2 {
      display: inline;
    }
    h1 {
      font-family: var(--font-handwriting);
      margin-right: var(--gap-small);
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
        <h1>${title}</h1>
        <h2>${secondsToDuration(duration)}</h2>
      </div>
    `
  }
}

customElements.define("bl-list-title", SourceIcon)
