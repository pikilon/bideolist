import { html, css, LitElement } from "lit"
import { search } from "../api/search.js"
import "./async-icon.js"
import "./loading-spinner.js"

const MILLISECONDS_TO_SUBMIT = 5 * 1000
export class SearchVideos extends LitElement {
  static properties = {
    lastQuery: { type: String, state: true },
    query: { type: String, state: true },
    waiting: { type: Boolean, state: true },
    loading: { type: Boolean, state: true },
    handleResults: { type: Function },
  }
  static styles = css`
    * {
      display: block;
      border: 0;
      outline: 0;
    }
    form {
      display: flex;
    }
    input {
      flex-grow: 1;
      padding: 0.5em 1em;
      margin-right: var(--gap-extra-small);
      f
    }

    input[disabled] {
      opacity: 0.4;
    }

    button {
      color: var(--color-light);
      background-color: var(--color-primary);
      width: 2.3em;
    }
    async-icon {
      display: inline-block
    }
  `

  disconnectedCallback() {
    this.clearTimeout()
  }
  constructor() {
    super()
    this.lastQuery = ""
    this.query = ""
    this.waiting = false
    this.loading = false
    this.unlockEditingTimeout = null
  }
  clearTimeout() {
    clearTimeout(this.unlockEditingTimeout)
  }

  handleSubmit = async (e) => {
    const results = {
      loading: false,
      videos: [],
      query: this.query,
    }
    e.preventDefault()
    if (!this.query) return this.handleResults(results)
    const shouldNotSubmit =
      this.waiting || !this.query || this.query === this.lastQuery
    if (shouldNotSubmit) return

    this.clearTimeout()

    this.lastQuery = this.query
    this.waiting = true
    this.loading = true

    const videos = await search(this.query)
    this.loading = false
    this.handleResults?.(videos)
    this.unlockEditingTimeout = setTimeout(() => {
      this.waiting = false
    }, MILLISECONDS_TO_SUBMIT)
    this.waiting = false
  }
  handleChange = (e) => (this.query = e.target.value.trim())

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <input
          required
          ?disabled=${this.loading}
          type="text"
          class="query"
          minlength="4"
          name="search-videos"
          placeholder="Search videos"
          @change=${this.handleChange}
        />
        <button
          type="submit"
          @click=${this.handleSearchClick}
          ?disabled=${this.loading}
        >
          ${this.loading
            ? html`<loading-spinner></loading-spinner>`
            : html`<async-icon name="magnifying-glass"></async-icon>`}
        </button>
      </form>
    `
  }
}

customElements.define("search-videos", SearchVideos)
