import { html, css, LitElement } from "lit"
import "./label.js"
import "./search-videos.js"
import "./video.js"

export class CreateList extends LitElement {
  static properties = {
    clearVideos: { type: Boolean, state: true },
    title: { type: String, state: true },
    videos: { type: Array, state: true },
    resultVideos: { type: Array, state: true },
    change: { type: Function },
  }

  static styles = css`
    .editor-line {
      display: flex;
      margin-bottom: var(--gap-medium);
    }
    .editor-line > :first-child {
      margin-right: var(--gap-medium);
    }
    .editor-line > * {
      flex-grow: 1;
      width: 50%;
    }
  `
  constructor() {
    super()
    this.title = "untitled"
    this.videos = []
    this.resultVideos = []
  }
  handleChange = () => {
    this.change?.({ title: this.title, videos: this.videos })
  }
  handleTitleChange = (e) => {
    const newTitle = e.target.value?.trim()
    this.title = newTitle.length > 0 ? newTitle : "untitled"
    this.handleChange()
  }
  handleResultClick = (video) => () => {
    this.videos = [...this.videos, video]
    this.handleChange()
  }
  handleVideoClick = (index) => () => {
    const newVideos = [...this.videos]
    newVideos.splice(index, 1)
    this.videos = newVideos
    this.handleChange()
  }

  render() {
    const { title, resultVideos, videos, handleTitleChange } = this
    return html`
      <div class="editor-line">
        <input
          type="text"
          name="new-list-title"
          placeholder="Set the list title"
          @keyup=${handleTitleChange}
        />

        <bl-label><h1>${title}</h1></bl-label>
      </div>
      <div class="editor-line">
        <div class="search-videos">
          <search-videos
            .handleResults=${(results) => (this.resultVideos = results)}
          ></search-videos>
          <div class="result-videos">
            ${resultVideos.map(
              (video) => html`
                <bl-video
                  video=${JSON.stringify(video)}
                  .handleClick=${this.handleResultClick(video)}
                ></bl-video>
              `
            )}
          </div>
        </div>
        <div class="results">
          ${videos.map(
            (video, index) => html`
              <bl-video
                video=${JSON.stringify(video)}
                .handleClick=${this.handleVideoClick(index)}
              ></bl-video>
            `
          )}
        </div>
      </div>
    `
  }
}

customElements.define("create-list", CreateList)
