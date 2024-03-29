import { html, LitElement } from "lit"
import renderReactPlayer from "renderReactPlayer"
import { subscribeActiveVideo } from "../store/computed.js"
import {
  STORE_NAMES,
  getUnsubscribeValue,
  setCurrentVideoElapsedSeconds,
  setNextPrevActive,
  handleSetPlaying,
  storeSelector,
} from "../store/store.js"

const PLAYER_ID = "player"

const DEBOUNCE_TIME = 10

class Player extends LitElement {
  static properties = {
    video: { type: Object, state: true },
    scriptLoaded: { type: Boolean, state: true },
  }
  constructor() {
    super()
    this.playedSeconds = 0
    this.debounceVideoUpdate = null

    this.unsubscribeActiveVideo = subscribeActiveVideo((video) => {
      clearTimeout(this.debounceVideoUpdate)
      this.debounceVideoUpdate = setTimeout(() => {
        if (!video?.id) return
        const isSameVideo =
          video.id === this.video?.id && video.source === this.video?.source
        if (isSameVideo) return
        this.video = video
        this.setPlayer()
      }, DEBOUNCE_TIME)
    })
    this.unsubscribePlaying = getUnsubscribeValue({
      storeName: STORE_NAMES.PLAYING,
      callback: (playing) => this.setPlayer({ playing }),
    })
  }
  disconnectedCallback() {
    this.unsubscribeActiveVideo()
    this.unsubscribePlaying()
    clearTimeout(this.debounceVideoUpdate)
  }


  onProgress = ({ playedSeconds }) =>
    setCurrentVideoElapsedSeconds(Math.round(playedSeconds))

  getOptions = () => ({
    url: this.video.url,
    playing: storeSelector(STORE_NAMES.PLAYING),
    controls: true,
    width: "100%",
    height: "100%",
    onReady: (player) => {
      this.player = player
    },

    onEnded: setNextPrevActive(),
    onPlay: handleSetPlaying(true),
    onPause: handleSetPlaying(false),
    onProgress: this.onProgress,
  })


  setPlayer = (options = {}) => {
    if (!this.video?.url) return
    const finalOptions = { ...this.getOptions(), ...options }
    const playerTag = document.getElementById(PLAYER_ID)
    renderReactPlayer(playerTag, finalOptions)

  }

  render() {

    return html`
      <div id=${PLAYER_ID}></div>
    `
  }
  createRenderRoot() {
    // Do not use a shadow root
    return this;
  }
}

customElements.define("bl-player", Player)
