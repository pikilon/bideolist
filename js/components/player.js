import { html, css, LitElement } from "lit"
import { classMap } from "lit/directives/class-map.js"
import { loadScript } from "../utils/loadScript.js"
import { container, resetAll } from "../../css/utility-classes.css.js"
import { subscribeActiveVideo } from "../store/computed.js"
import {
  storeSelector,
  STORE_NAMES,
  setActive,
  setCurrentVideoElapsedSeconds,
} from "../store/store.js"

const PLAYER_ID = "player"

const DEFAULT_OPTIONS = {
  playing: true,
  controls: true,
  width: "100%",
  height: "100%",
}

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
  constructor() {
    super()
    this.playedSeconds = 0
    this.playing = true

    this.unsubscribeActiveVideo = subscribeActiveVideo((video) => {
      if (!video?.id) return
      const isSameVideo =
        video.id === this.video?.id && video.source === this.video?.source
      if (isSameVideo) return
      this.video = video
      this.createPlayer()
    })
  }

  onEnded = () => {
    const nextIndex = storeSelector(STORE_NAMES.ACTIVE) + 1
    const videos = storeSelector(STORE_NAMES.VIDEOS)

    if (nextIndex < videos.length) setActive(nextIndex)
  }
  onProgress = ({ playedSeconds }) =>
    setCurrentVideoElapsedSeconds(Math.round(playedSeconds))

  getOptions = () => ({
    url: this.video.url,
    playing: this.playing,
    controls: true,
    width: "100%",
    onEnded: this.onEnded,
    onProgress: this.onProgress,
  })

  onPlayerStateChange = (event) => {
    const { data } = event
    if (data === YT.PlayerState.ENDED) this.onEnded()
  }

  togglePlayPause = () => {
    this.playing = !this.playing
    this.setPlayer({ playing: this.playing })
  }

  createPlayer = () => {
    loadScript(
      // https://github.com/cookpete/react-player#standalone-player
      "https://unpkg.com/react-player@2.9.0/dist/ReactPlayer.standalone.js"
    ).then(this.setPlayer)
  }

  setPlayer = (options = {}) => {
    if (!this.video.url) return
    const { renderReactPlayer } = window
    const finalOptions = { ...this.getOptions(), ...options }
    const playerTag = this.shadowRoot.getElementById(PLAYER_ID)
    renderReactPlayer(playerTag, finalOptions)
  }
  toggleWide = () => (this.isWide = !this.isWide)

  render() {
    const { isWide, toggleWide, togglePlayPause } = this
    return html`
      <div
        class=${classMap({
          "player-wrapper player-youtube": true,
          container: !isWide,
        })}
      >
        <div id=${PLAYER_ID}></div>
      </div>
      <div class="container">
        <button @click=${toggleWide}>Toggle wide</button>
        <button @click=${togglePlayPause}>Toggle Play/Pause</button>
      </div>
    `
  }
}

customElements.define("bl-player", Player)
