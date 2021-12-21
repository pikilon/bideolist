import { html, css, LitElement } from "https://unpkg.com/lit?module"
import { youtubeFetchVideos } from "./sources/youtube.js"
import { YOUTUBE_API_KEY } from "/config.js"

export class SimpleGreeting extends LitElement {
  static styles = css`
    p {
      color: "blue";
    }
  `

  static properties = {
    name: { type: String },
  }

  constructor() {
    super()
    this.name = "Somebody"
    const sampleIds = ["7lCDEYXw3mM", "RUyTN9hajHY"]
    youtubeFetchVideos(sampleIds).then(console.log)
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`
  }
}

customElements.define("simple-greeting", SimpleGreeting)
