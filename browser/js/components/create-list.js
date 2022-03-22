import { html, css, LitElement } from "lit"
import { STORE_NAMES, upsertList, getUnsubscribeValue } from "../store/store.js"
import { generateListUrlQuery } from "../store/url.js"
import "./label.js"

export class CreateList extends LitElement {
  static properties = {
    title: { type: String, state: true },
    videos: { type: Array, state: true },
  }
  static styles = css`
    .editor {
      display: flex;
    }
    .editor > * {
      flex-grow: 1;
    }
  `
  handleTitleChange = (e) => {
    const newTitle = e.target.value?.trim()
    this.title = newTitle.length > 0 ? newTitle : "untitled"
  }

  render() {
    const { title = "untitled", videos = [], handleTitleChange } = this
    return html`
      <div class="editor">
        <div class="inputs">
          <input
            type="text"
            name="title"
            placeholder="Set the list title"
            @keyup=${handleTitleChange}
          />
        </div>
        <div class="results">
          <bl-label><h1>${title}</h1></bl-label>
        </div>
      </div>
    `
  }
}

customElements.define("create-list", CreateList)
