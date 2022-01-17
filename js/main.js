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
    const { formattedDuration, videos, duration } = this._videosInfo

    return duration
      ? html`
          <p>Bideolist! ${formattedDuration}</p>
          <div>
            ${videos.map(
              ({
                id,
                source,
                title,
                description,
                thumbUrl,
                durationSeconds,
              }) => html`
                <bl-video
                  id=${id}
                  source=${source}
                  title=${title}
                  description=${description}
                  thumbUrl=${thumbUrl}
                  durationSeconds=${durationSeconds}
                ></bl-video>
              `
            )}
          </div>
        `
      : html`<p>Loading...</p>`
  }
}

customElements.define("bl-main", MainWrapper)
