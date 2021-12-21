import { html, css, LitElement } from "https://unpkg.com/lit?module"
import { youtubeFetchVideos } from "./sources/youtube.js"
import { dailymotionFetchVideos } from "./sources/dailymotion.js"

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
    const sampleYT = ["7lCDEYXw3mM", "RUyTN9hajHY", "YEW_UFm4Xe4"]
    const sampleDM = ["x86h9zq", "x14lnch"]
    youtubeFetchVideos(sampleYT).then(console.log)
    dailymotionFetchVideos(sampleDM).then(console.log)
    // vimeo with URIs https://developer.vimeo.com/api/reference/videos?version=3.4#search_videos
    // uris /videos/253497000,/videos/81329596
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`
  }
}

customElements.define("simple-greeting", SimpleGreeting)
