import { html, css, LitElement } from "lit"
import { search } from "../api/search.js"
import { addVideo } from "../store/edit-videos-order.js"

const MILLISECONDS_TO_SUBMIT = 5 * 1000
export class Search extends LitElement {
  static properties = {
    lastQuery: { type: String, state: true },
    query: { type: String, state: true },
    videos: { type: Array, state: true },
    waiting: { type: Boolean, state: true },
  }
  static styles = css``

  disconnectedCallback() {
    this.clearTimeout()
  }
  constructor() {
    super()
    this.lastQuery = ""
    this.query = ""
    this.videos = []
    this.waiting = false
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
    console.log("this.query", this.query)
    this.videos = await search(this.query)
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

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <input
          required
          type="text"
          class="query"
          minlength="4"
          placeholder="Search videos"
          @change=${(e) => (this.query = e.target.value.trim())}
        />
        <button type="submit" @click=${this.handleSearchClick}>search</button>
        ${this.videos.length > 0
          ? html`
              <ul>
                ${this.videos.map(
                  ({ title, ...video }) => html`
                    <li @click=${this.handleResultClick(video)}>${title}</li>
                  `
                )}
              </ul>
            `
          : ""}
      </form>
    `
  }
}

customElements.define("bl-search", Search)
