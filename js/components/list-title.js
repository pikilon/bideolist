import { html, css, LitElement } from "lit"
import { subscribeVideosDuration } from "../store/computed.js"
import { secondsToDuration } from "../utils/secondsToDuration.js"

export class SourceIcon extends LitElement {
  static properties = {
    name: { type: String, state: true },
    duration: { type: Number, state: true },
  }
  static styles = css`
    .list-title {
      background-color: var(--color-light);
      color: var(--color-dark);
      padding: var(--gap-medium);
    }
    h1, h2 {
      display: inline;
    }
    h1 {
      font-family: var(--font-handwriting);
      margin-right: var(--gap-small);
    }
  `
  setNameDuration = ({ listName, duration }) => {
    this.name = listName
    this.duration = duration
  }
  constructor() {
    super()
    this.name = "untitled"
    this.duration = 0
    const [nameDuration, unsubscribeNameDuration] = subscribeVideosDuration(
      this.setNameDuration
    )

    this.setNameDuration(nameDuration)
    this.unsubscribeNameDuration = unsubscribeNameDuration
  }
  disconnectedCallback() {
    this.unsubscribeNameDuration()
  }
  render() {
    const { name = "untitled", duration = 0 } = this
    return html`
      <div class="list-title">
        <h1>${name}</h1>
        <h2>${secondsToDuration(duration)}</h2>
      </div>
    `
  }
}

customElements.define("bl-list-title", SourceIcon)
