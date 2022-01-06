import { html, css, LitElement } from "https://unpkg.com/lit?module"
import { fetchAllVideos } from "./api/fetchAllVideos.js"
import { SOURCES } from "./constants.js"

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
    const sampleList = [
      { source: SOURCES.YOUTUBE.ID, id: "7lCDEYXw3mM" },
      { source: SOURCES.YOUTUBE.ID, id: "RUyTN9hajHY" },
      { source: SOURCES.YOUTUBE.ID, id: "YEW_UFm4Xe4" },
      { source: SOURCES.DAILYMOTION.ID, id: "x86h9zq" },
      { source: SOURCES.DAILYMOTION.ID, id: "x14lnch" },
      { source: SOURCES.VIMEO.ID, id: "253497000" },
      { source: SOURCES.VIMEO.ID, id: "81329596" },
    ]
    fetchAllVideos(sampleList).then(console.log)

  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`
  }
}

customElements.define("simple-greeting", SimpleGreeting)
