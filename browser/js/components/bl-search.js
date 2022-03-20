import { html, css, LitElement } from "lit"
import { search } from "../api/search.js"
import { addVideo } from "../store/edit-videos-order.js"
import "./loading-spinner.js"
import "./video.js"
import "./async-icon.js"

const MILLISECONDS_TO_SUBMIT = 5 * 1000
export class Search extends LitElement {
  static properties = {
    lastQuery: { type: String, state: true },
    query: { type: String, state: true },
    videos: { type: Array, state: true },
    waiting: { type: Boolean, state: true },
    loading: { type: Boolean, state: true },
  }
  static styles = css`
    .drag-wrapper {
      display: flex;
      align-items: center;
    }
    [draggable="true"] {
      opacity: 0.4;
    }
    .grab-handler {
      cursor: grab;
      font-size: 0.7em;
      padding: 1em 0.5em;
    }
  `

  disconnectedCallback() {
    this.clearTimeout()
  }
  constructor() {
    super()
    this.lastQuery = ""
    this.query = ""
    this.videos = []
    this.waiting = false
    this.loading = false
    this.unlockEditingTimeout = null
  }
  clearTimeout() {
    clearTimeout(this.unlockEditingTimeout)
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    if (!this.query) this.videos = []
    const shouldNotSubmit =
      this.waiting || !this.query || this.query === this.lastQuery
    if (shouldNotSubmit) return

    this.clearTimeout()
    this.lastQuery = this.query
    this.waiting = true
    this.loading = true
    this.videos = await search(this.query)
    this.loading = false
    this.unlockEditingTimeout = setTimeout(() => {
      this.waiting = false
    }, MILLISECONDS_TO_SUBMIT)
    this.waiting = false
  }

  handleSearchClick = () => {
    const shouldClearVideos = !this.query && this.videos.length > 0
    if (shouldClearVideos) this.videos = []
  }
  handleResultClick = (video) => () => {
    addVideo(video.composedId)
  }
  handleMouseDown = (e) => {
    const dragWrapper = e.target.closest(".drag-wrapper")
    dragWrapper.setAttribute("draggable", true)
  }
  dragEnds = (e) => {
    e.target.setAttribute("draggable", false)
  }
  addVideoEnd = (composedId) => () => addVideo(composedId, -1)

  dragStart = (composedId) => (e) => {
    e.dataTransfer.setData("text/plain", composedId)
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <input
          required
          type="text"
          class="query"
          minlength="4"
          name="search-videos"
          placeholder="Search videos"
          @change=${(e) => (this.query = e.target.value.trim())}
        />
        <button type="submit" @click=${this.handleSearchClick}>search</button>
        ${this.loading
          ? html`<div><loading-spinner></loading-spinner></div>`
          : ""}
        ${this.videos.length > 0
          ? html`
              <section class="results">
                ${this.videos.map(
                  (video) => html`
                    <div
                      class="drag-wrapper"
                      @dragstart=${this.dragStart(video.composedId)}
                      @dragend=${this.dragEnds}
                    >
                      <async-icon
                        class="grab-handler"
                        name="grip-vertical"
                        @mousedown=${this.handleMouseDown}
                      ></async-icon>
                      <bl-video
                        video=${JSON.stringify(video)}
                        .handleClick=${this.addVideoEnd(video.composedId)}
                      ></bl-video>
                    </div>
                  `
                )}
              </section>
            `
          : ""}
      </form>
    `
  }
}

customElements.define("bl-search", Search)
