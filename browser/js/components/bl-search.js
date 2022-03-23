import { html, css, LitElement } from "lit"
import { search } from "../api/search.js"
import { addVideo } from "../store/edit-videos-order.js"
import "./loading-spinner.js"
import "./video.js"
import "./async-icon.js"
import "./search-videos.js"

export class Search extends LitElement {
  static properties = {
    videos: { type: Array, state: true },
  }
  static styles = css`
    .search-videos {
      width: 20em;
      margin-bottom: var(--gap-medium);
    }
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
  constructor() {
    super()
    this.videos = []
  }

  handleSearchResults = (videos) => {
    this.videos = videos
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
      <div>
        <div class="search-videos">
          <search-videos
            .handleResults=${this.handleSearchResults}
          ></search-videos>
        </div>
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
      </div>
    `
  }
}

customElements.define("bl-search", Search)
