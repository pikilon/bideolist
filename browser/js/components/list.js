import { html, css, LitElement } from "lit"
import { classMap } from "lit/directives/class-map.js"

import "./video.js"
import { getUnsubscribeVideosTotalDuration } from "../store/computed.js"
import {
  getUnsubscribeValue,
  STORE_NAMES,
  fetchNewVideos,
  setActive,
} from "../store/store.js"
import { removeVideo, moveVideo, addVideo } from "../store/edit-videos-order.js"
import "./async-icon.js"

export class BList extends LitElement {
  static properties = {
    videos: { type: Array, state: true },
    activeVideo: { type: Number, state: true },
    draggingIndex: { type: Number, state: true },
    draggingElementHeight: { type: Number, state: true },
    draggingOverIndex: { type: Number, state: true },
  }

  static styles = css`
    .video {
      display: flex;
      align-items: center;
      position: relative;
    }
    .video + .video {
      margin-top: var(--gap-small);
    }
    .handle {
      cursor: grab;
      font-size: 0.7em;
      padding: 1em 0.5em;
    }
    .video:active .handle {
      cursor: grabbing;
    }
    [draggable="true"] {
      opacity: 0.4;
    }

    /* leaves a margin on top when is over another video */
    .drag-over:not([draggable="true"]):not([draggable="true"] + .drag-over) {
      padding-top: calc(var(--dragging-height) + var(--gap-small));
    }
    .drag-over:not([draggable="true"]):not([draggable="true"]
        + .drag-over):before {
      height: var(--dragging-height);
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      border: 3px solid var(--color-light-gray);
      border-radius: 0.5em;
    }
    .video-wrapper {
      flex-grow: 1;
    }

    .trash {
      font-size: 1.5em;
      background-color: var(--color-dark-gray);
      display: inline-block;
      transition: all 0.2s;

      border-radius: 100%;
      padding: 0.6em;
      text-align: center;
    }
    .trash.isDragging {
      background-color: var(--color-primary);
    }
  `

  constructor() {
    super()
    this.resetDraggingIndexes()
    const unsubscribeActive = getUnsubscribeValue({
      storeName: STORE_NAMES.ACTIVE,
      callback: (active) => (this.activeVideo = active),
    })

    const unsubscribeVideosInfo = getUnsubscribeVideosTotalDuration(
      ({ videos, compoundIds }) => {
        this.videos = videos
        fetchNewVideos(compoundIds)
      }
    )

    this.unsubscribeAll = () => {
      unsubscribeActive()
      unsubscribeVideosInfo()
    }
  }
  disconnectedCallback() {
    this.unsubscribeAll()
  }
  setValues = ({ videos }) => {
    this.videos = videos
  }
  resetDraggingIndexes() {
    this.draggingIndex = -1
    this.draggingOverIndex = -1
    this.draggingElementHeight = 90
  }
  handleMouseDownDrag = (index) => (e) => {
    this.draggingIndex = index
    const videoElement = e.target.closest(".video")
    videoElement.setAttribute("draggable", "true")
    const videoElementHeight = videoElement.clientHeight
    this.draggingElementHeight = videoElementHeight
  }
  handleDragEnds = () => {
    const oldIndex = this.draggingIndex
    const newIndex = this.draggingOverIndex
    this.resetDraggingIndexes()
    if (oldIndex === newIndex) return

    moveVideo(oldIndex, newIndex)
  }
  handleDragOver = (index) => () => {
    this.draggingOverIndex = index
  }

  handleDropTrash = (e) => {
    // don't delete playing video
    if (this.activeVideo === this.draggingIndex) return
    const indexToRemove = this.draggingIndex
    removeVideo(indexToRemove)
    this.resetDraggingIndexes()
  }

  listDrop = (e) => {
    e.preventDefault()
    const composedId = e.dataTransfer.getData("text/plain")
    if (!composedId) return this.handleDragEnds()
    const index = this.draggingOverIndex
    addVideo(composedId, index)
    this.resetDraggingIndexes()
  }

  setActive = (index) => () => setActive(index, true)
  dragEnd = (e) => e.target.setAttribute("draggable", "false")

  render() {
    const {
      videos,
      activeVideo,
      draggingIndex,
      handleMouseDownDrag,
      draggingOverIndex,
      handleDragOver,
      setActive,
      draggingElementHeight,
      dragEnd,
    } = this
    if (!videos?.length) return
    const draggingHeightStyle = `--dragging-height: ${draggingElementHeight}px`

    const isDragging = draggingIndex !== -1

    return html`
      <div
        class=${classMap({ trash: true, isDragging })}
        @drop=${this.handleDropTrash}
        @dragover=${(e) => e.preventDefault()}
      >
        <async-icon name="trash-can"></async-icon>
      </div>
      <div
        class="list"
        style=${draggingHeightStyle}
        @drop=${this.listDrop}
        @dragover=${(e) => e.preventDefault()}
      >
        ${videos.map((video, index) => {
          const isDraggedVideo = index === draggingIndex
          const videoClass = classMap({
            video: true,
            "drag-over": index === draggingOverIndex,
          })
          return html`
            <div
              class=${videoClass}
              @dragenter=${handleDragOver(index)}
              @dragend=${dragEnd}
            >
              <div class="handle" @mousedown=${handleMouseDownDrag(index)}>
                <async-icon name="grip-vertical"></async-icon>
              </div>
              <div class="video-wrapper">
                <bl-video
                  video=${JSON.stringify(video)}
                  ?active="${index === activeVideo}"
                  .handleClick=${setActive(index)}
                ></bl-video>
              </div>
            </div>
          `
        })}
      </div>
    `
  }
}

customElements.define("bl-list", BList)
