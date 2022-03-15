import { html, css, LitElement } from "lit"
import { classMap } from "lit/directives/class-map.js"

import "./video.js"
import { getUnsubscribeVideosTotalDuration } from "../store/computed.js"
import {
  getUnsubscribeValue,
  STORE_NAMES,
  fetchNewVideos,
} from "../store/store.js"
import { removeVideo, moveVideo, addVideo } from "../store/edit-videos-order.js"
import "./async-icon.js"

export class BList extends LitElement {
  static properties = {
    videos: { type: Array, state: true },
    activeVideo: { type: Number, state: true },
    draggingIndex: { type: Number, state: true },
    draggingOverIndex: { type: Number, state: true },
  }

  static styles = css`
    .video {
      display: flex;
      align-items: center;
    }
    .video + .video {
      margin-top: var(--gap-small);
    }
    .handle {
      font-size: 2em;
      width: 0.5em;
      word-break: break-all;
      line-height: 0.2em;
      cursor: move;
    }
    .is-dragged {
      opacity: 0.4;
    }

    /* leaves a margin on top when is over another video */
    .drag-over:not(.is-dragged):not(.is-dragged + .drag-over) {
      margin-top: 100px;
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
    this.draggingIndex = -1
    this.draggingOverIndex = -1
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
  }
  handleMouseDownDrag = (index) => () => {
    this.draggingIndex = index
  }
  handleDragEnds = () => {
    const oldIndex = this.draggingIndex
    const newIndex = this.draggingOverIndex
    this.resetDraggingIndexes()
    if (oldIndex === newIndex) return
    moveVideo(oldIndex, newIndex)
  }
  handleDragOver = (index, isDragged) => () => {
    if (!isDragged) return (this.draggingOverIndex = index)
  }

  handleDropTrash = (e) => {
    // don't delete playing video
    if (this.activeVideo === this.draggingIndex) return
    const indexToRemove = this.draggingIndex
    removeVideo(indexToRemove)
    this.resetDraggingIndexes()
  }

  listDrop = (e) => {
    const composedId = e.dataTransfer.getData("text/plain")
    if (!composedId) return
    const index = this.draggingOverIndex
    addVideo(composedId, index)
    this.resetDraggingIndexes()
  }

  render() {
    const {
      videos,
      activeVideo,
      draggingIndex,
      handleDragEnds,
      handleMouseDownDrag,
      draggingOverIndex,
      handleDragOver,
      handleDragLeave,
    } = this
    if (!videos?.length) return

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
        @drop=${this.listDrop}
        @dragover=${(e) => e.preventDefault()}
      >
        ${videos.map((video, index) => {
          const isDraggedVideo = index === draggingIndex
          const videoClass = classMap({
            video: true,
            "is-dragged": isDraggedVideo,
            "drag-over": index === draggingOverIndex,
          })
          return html`
            <div
              class=${videoClass}
              draggable=${isDraggedVideo}
              @dragend=${handleDragEnds}
              @dragenter=${handleDragOver(index)}
              @dragleave=${handleDragLeave}
            >
              <div class="handle" @mousedown=${handleMouseDownDrag(index)}>
                ···
              </div>
              <div class="video-wrapper">
                <bl-video
                  video=${JSON.stringify(video)}
                  ?active="${index === activeVideo}"
                  index="${index}"
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
