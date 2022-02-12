import { html, css, LitElement } from "lit"
import { classMap } from "lit/directives/class-map.js"
import { secondsToDuration } from "../utils/secondsToDuration.js"
import { setUrlParams } from "../store/store.js"
import "./source-icon.js"

export class Video extends LitElement {
  static styles = css`
    * {
      padding: 0;
      margin: 0;
    }
    article {
      display: flex;
      align-items: center;
      border-radius: 0.5em;
      overflow: hidden;
      border: 3px solid transparent;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
    }
    .active {
      border-color: var(--color-primary);
    }

    .thumb {
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      margin-right: var(--gap-small);
      height: 90px;
      background-color: var(--color-dark);
    }
    .hoverThumb {
      position: absolute;
      bottom: var(--gap-extra-small);
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      padding: var(--gap-extra-small);
      padding-bottom: 0;
      z-index: 1;
    }
    .duration {
      font-size: 0.8em;
      display: inline-block;
      line-height: 1.75em;
      background-color: var(--color-dark);
      border-radius: 0.5em;
      padding: 0.2em 0.3em;
      opacity: 0.8;
    }
    img {
      max-width: 120px;
    }
    header {
      border: 1px green solid;
    }
    h1 {
      font-weight: normal;
      font-size: 1em;
    }
  `

  static properties = {
    video: { type: Object },
    active: { type: Boolean },
    index: { type: Number },
  }

  setActive = () => {
    setUrlParams({ active: this.index })
  }

  get _formattedDuration() {
    return secondsToDuration(this.video.durationSeconds)
  }

  render() {
    if (!this.video) return
    const { video, active } = this
    const { id, source, title, thumbUrl } = video
    return html`
      <article class=${classMap({ active })}>
        <div class="thumb">
          <img src="${thumbUrl}" alt="${title}" @click=${this.setActive} />
          <div class="hoverThumb">
            <bl-source-icon source=${source} id="${id}"></bl-source-icon>
            <span class="duration" @click=${this.setActive}
              >${this._formattedDuration}</span
            >
          </div>
        </div>

        <h1 @click=${this.setActive}>${title}</h1>
      </article>
    `
  }
}

customElements.define("bl-video", Video)
