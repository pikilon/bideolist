import { html, css, LitElement } from "lit"
import { classMap } from "lit/directives/class-map.js"
import { loadScript } from "../utils/loadScript.js"
import { container, resetAll } from "../../css/utility-classes.css.js"
import { subscribeActiveVideo } from "../store/computed.js"

const PLAYER_ID = "player"

class Player extends LitElement {
  static properties = {
    video: { type: Object, state: true },
    scriptLoaded: { type: Boolean, state: true },
    isWide: { type: Boolean, state: true },
  }
  static styles = css`
    ${resetAll}
    ${container}
    .player-wrapper {
      aspect-ratio: 16/9;
    }
  `
  setTitleDuration = ({ title, duration }) => {
    this.title = title
    this.duration = duration
  }
  constructor() {
    super()
    this.player = null

    this.unsubscribeActiveVideo = subscribeActiveVideo((video) => {
      const isSameVideo =
        video.id === this.video?.id && video.source === this.video?.source
      if (isSameVideo) return
      this.destroyPlayer()
      console.log("isSameVideo", isSameVideo)
      this.video = video
      this.createPlayer()
    })
  }

  destroyPlayer = () => {
    if (this.player) this.player.destroy()
  }

  onPlayerStateChange = (event) => {
    console.log("event", event)
  }

  onPlayerReady = (event) => {
    event.target.playVideo()
  }

  createPlayer = () => {
    loadScript("https://www.youtube.com/iframe_api").then(() => {
      window.YT.ready(this.setPlayer)
    })
  }

  setPlayer = () => {
    const playerTag = this.shadowRoot.getElementById(PLAYER_ID)

    this.player = new YT.Player(playerTag, {
      height: "100%",
      width: "100%",
      videoId: this.video.id,

      // events: {
      //   onReady: this.onPlayerReady,
      //   onStateChange: this.onPlayerStateChange,
      // },
    })
    console.log("this.player", this.player)
  }
  toggleWide = () => (this.isWide = !this.isWide)

  render() {
    const { isWide, toggleWide } = this
    return html`
      <div
        class=${classMap({
          "player-wrapper player-youtube": true,
          container: !isWide,
        })}
      >
        <div id=${PLAYER_ID}></div>
        <button @click=${toggleWide}>Toggle wide</button>
      </div>
    `
  }
}

customElements.define("bl-player", Player)
