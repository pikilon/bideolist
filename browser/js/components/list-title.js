import { html, css, LitElement } from "lit"
import { getUnsubscribeVideosTotalDuration } from "../store/computed.js"
import {
  getUnsubscribeValue,
  setListTitle,
  STORE_NAMES,
} from "../store/store.js"
import { secondsToDuration } from "../utils/secondsToDuration.js"
import { container } from "../../css/utility-classes.css.js"
import "./label.js"
import "./async-icon.js"
export class SourceIcon extends LitElement {
  static properties = {
    title: { type: String, state: true },
    duration: { type: Number, state: true },
    editing: { type: Boolean, state: true },
  }
  static styles = css`
    ${container}
    .container {
      text-align: center;
    }
    .list-title {
      position: relative;
      display: inline-block;

      color: var(--color-dark);
    }
    .edit-toggle {
      position: absolute;
      left: var(--gap-small);
      bottom: var(--gap-small);
    }
  `
  setTitleDuration = ({ title, duration }) => {
    this.title = title
    this.duration = duration
  }
  constructor() {
    super()
    const unsubscribeVideos = getUnsubscribeVideosTotalDuration(
      ({ totalDuration }) => {
        this.duration = totalDuration
      }
    )
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

  setFocusEditable = () => {
    const titleElement = this.shadowRoot.querySelector("h1")
    titleElement.focus()
  }
  focusEditable = () => (this.editing = true)
  blurEditable = (e) => {
    this.editing = false
    const newTitle = e.target.innerText
    if (newTitle === this.title) return
    setListTitle(newTitle)
  }
  render() {
    const { title = "untitled", duration = 0, editing } = this
    const iconName = editing ? "floppy-disk" : "pen"
    return html`
      <div class="container">
        <div class="list-title">
          <button class="edit-toggle" @click=${this.setFocusEditable}>
            <async-icon name=${iconName}></async-icon>
          </button>
          <bl-label>
            <h1
              contenteditable="true"
              @focus=${this.focusEditable}
              @blur=${this.blurEditable}
            >
              ${title}
            </h1>
            <h2>${secondsToDuration(duration)}</h2>
          </bl-label>
        </div>
      </div>
    `
  }
}

customElements.define("bl-list-title", SourceIcon)
