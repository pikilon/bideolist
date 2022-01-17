import { html, css, LitElement } from "https://unpkg.com/lit?module"
import { secondsToDuration } from "../secondsToDuration.js"

export class Video extends LitElement {
  static styles = css`
    p {
      color: "blue";
    }
  `

  static properties = {
    video: { type: Object },
  }

  get _formattedDuration() {
    return secondsToDuration(this.video.durationSeconds)
  }

  render() {
    if (!this.video) return
    const { id, source, title, description, thumbUrl } = this.video
    return html`
      <article>
        <h1>${source}: ${title}</h1>
        <h2>${this._formattedDuration}</h2>
        <img src="${thumbUrl}" alt="${title}" />
      </article>
    `
  }
}

customElements.define("bl-video", Video)
