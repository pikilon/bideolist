import { html, css, LitElement } from "lit"
import { classMap } from "lit/directives/class-map.js"
import { loadScript } from "../utils/loadScript.js"
import { container, resetAll } from "../../css/utility-classes.css.js"
import { subscribeActiveVideo } from "../store/computed.js"
import { storeSelector, STORE_NAMES, setActive } from "../store/store.js"

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
    iframe {
      width: 100% !important;
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
      if (!video?.id) return
      const isSameVideo =
        video.id === this.video?.id && video.source === this.video?.source
      if (isSameVideo) return
      this.destroyPlayer()
      this.video = video
      this.createPlayer()
    })
  }

  nextVideo = () => {
    debugger
    const nextIndex = storeSelector(STORE_NAMES.ACTIVE) + 1
    const videos = storeSelector(STORE_NAMES.VIDEOS)

    if (nextIndex < videos.length) setActive(nextIndex)
  }

  destroyPlayer = () => {
    if (this.player) this.player.destroy()
  }

  onPlayerStateChange = (event) => {
    const { data } = event
    if (data === YT.PlayerState.ENDED) this.nextVideo()
  }

  onPlayerReady = (event) => {
    event.target.playVideo()
  }

  createPlayer = () => {
    // https://developer.vimeo.com/player/sdk/basics
    loadScript("https://player.vimeo.com/api/player.js").then(() => {
      this.setPlayer()
    })
  }

  setPlayer = () => {
    const playerTag = this.shadowRoot.getElementById(PLAYER_ID)
    const url = "https://player.vimeo.com/video/" + this.video.id

    this.player = new Vimeo.Player(playerTag, {
      url,
      autoplay: 1,
    });
    this.player.on("ended", this.nextVideo)
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
