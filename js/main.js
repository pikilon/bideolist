import { html, css, LitElement } from "https://unpkg.com/lit?module"
import { fetchAllVideosFromString } from "./api/fetchAllVideos.js"
import { secondsToDuration } from "./secondsToDuration.js"
import "./components/video.js"

export class MainWrapper extends LitElement {
  static styles = css`
    p {
      color: "blue";
    }
  `

  static properties = {
    _videosInfo: { type: Object, state: true },
  }

  constructor() {
    super()
    this._videosInfo = { formattedDuration: "00:00:00" }
    const queryParams = new URLSearchParams(window.location.search)
    const videosString = queryParams.get("videos")
    if (videosString)
      fetchAllVideosFromString(videosString).then((videosInfo) => {
        this._videosInfo = {
          ...videosInfo,
          formattedDuration: secondsToDuration(videosInfo.duration),
        }
      })
  }

  render() {
    const { formattedDuration, videos } = this._videosInfo
    if (!videos?.length) return

    return html`
      <p>Bideolist! ${formattedDuration}</p>
      ${videos.map(
        (video) => html`<bl-video video=${JSON.stringify(video)}></bl-video>`
      )}
    `
  }
}

customElements.define("bl-main", MainWrapper)
