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
  setNextPrevActive,
} from "../store/store.js"
import "./player-button.js"

const PLAYER_ID = "player"

const DEBOUNCE_TIME = 10

class Player extends LitElement {
  static properties = {
    video: { type: Object, state: true },
    scriptLoaded: { type: Boolean, state: true },
    isWide: { type: Boolean, state: true },
    playing: { type: Boolean, state: true },
  }
  static styles = css`
    ${resetAll}
    ${container}
    .player-wrapper {
      aspect-ratio: 16/9;
    }
    .controls {
      display: flex;
    }
  `
  constructor() {
    super()
    this.playedSeconds = 0
    this.playing = true
    this.debounceVideoUpdate = null

    this.unsubscribeActiveVideo = subscribeActiveVideo((video) => {
      clearTimeout(this.debounceVideoUpdate)
      this.debounceVideoUpdate = setTimeout(() => {
        if (!video?.id) return
        const isSameVideo =
          video.id === this.video?.id && video.source === this.video?.source
        if (isSameVideo) return
        this.video = video
        this.createPlayer()
      }, DEBOUNCE_TIME)
    })
  }
  disconnectedCallback() {
    this.unsubscribeActiveVideo()
    clearTimeout(this.debounceVideoUpdate)
  }

  onEnded = () => {
    const nextIndex = storeSelector(STORE_NAMES.ACTIVE) + 1
    const videos = storeSelector(STORE_NAMES.VIDEOS)

    if (nextIndex < videos.length) setActive(nextIndex, true)
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

  setPlaying = (playing) => () => {
    this.playing = playing
    this.setPlayer({ playing })
  }
  setPrevNextTrack = (prev) => () => setNextPrevActive(prev)

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
    const { isWide, toggleWide, playing, setPlaying, setPrevNextTrack } = this
    const playPauseIcon = playing ? "pause" : "play"
    console.log('playPauseIcon', playPauseIcon);
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
        <div class="controls">
          <player-button .click=${setPrevNextTrack(true)} text="Previous" iconName="backward-step" first></player-button>
          <player-button ?active=${playing} .click=${setPlaying(true)} text="Play" iconName="play"></player-button>
          <player-button ?active=${!playing} .click=${setPlaying(false)} text="Pause" iconName="pause"></player-button>
          <player-button .click=${setPrevNextTrack(false)} text="Next" iconName="forward-step" last></player-button>
        </div>
      </div>
    `
  }
}

customElements.define("bl-player", Player)
