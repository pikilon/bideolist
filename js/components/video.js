import { html, css, LitElement } from "https://unpkg.com/lit?module"
import { secondsToDuration } from "../secondsToDuration.js"

export class Video extends LitElement {
  static styles = css`
    p {
      color: "blue";
    }
  `

  static properties = {
    id: { type: String },
    source: { type: String },
    title: { type: String },
    description: { type: String },
    thumbUrl: { type: String },
    durationSeconds: { type: Number },
  }

  get _formattedDuration() {
    return secondsToDuration(this.durationSeconds)
  }

  render() {
    const { id, source, title, description, thumbUrl, _formattedDuration } =
      this
    return html`
      <article>
        <h1>${source}: ${title}</h1>
        <h2>${_formattedDuration}</h2>
        <img src="${thumbUrl}" alt="${title}" />
      </article>
    `
  }
}

customElements.define("bl-video", Video)
