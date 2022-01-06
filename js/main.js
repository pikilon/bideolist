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
    // http://local.bideolist.com:5500/?videos=yt:7lCDEYXw3mM,yt:RUyTN9hajHY,yt:YEW_UFm4Xe4,dm:x86h9zq,dm:x14lnch,vi:253497000,vi:81329596
    const videosString = queryParams.get("videos")
    if (videosString) fetchAllVideosFromString(videosString).then(console.log)
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`
  }
}

customElements.define("simple-greeting", SimpleGreeting)
