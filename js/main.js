import { html, css, LitElement } from "https://unpkg.com/lit?module"
import { fetchAllVideosFromString } from "./api/fetchAllVideos.js"

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
    const queryParams = new URLSearchParams(window.location.search)
    const videosString = queryParams.get("videos")
    if (videosString) fetchAllVideosFromString(videosString).then(console.log)
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`
  }
}

customElements.define("simple-greeting", SimpleGreeting)
