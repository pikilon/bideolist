import { html, css, LitElement } from "lit"
import { classMap } from "lit/directives/class-map.js"
import { secondsToDuration } from "../secondsToDuration.js"
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
    }
    .hoverThumb {
      position: absolute;
      bottom: 0;
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
  }

  get _formattedDuration() {
    return secondsToDuration(this.video.durationSeconds)
  }

  render() {
    if (!this.video) return
    const { video, active } = this
    const { id, source, title, description, thumbUrl } = video
    return html`
      <article class=${classMap({ active })}>
        <div class="thumb">
          <img src="${thumbUrl}" alt="${title}" />
          <div class="hoverThumb">
            <bl-source-icon source=${source} id="${id}"></bl-source-icon>
            <span class="duration">${this._formattedDuration}</span>
          </div>
        </div>

        <h1>${title}</h1>
      </article>
    `
  }
}

customElements.define("bl-video", Video)
