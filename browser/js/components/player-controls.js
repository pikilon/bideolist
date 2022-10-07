import { html, css, LitElement } from "lit"
import {
  checkFullscreen,
  turnFullscreen,
  subscribeFullscreen,
} from "../fullscreen-control.js"
import {
  STORE_NAMES,
  handleSetPlaying,
  setNextPrevActive,
  getUnsubscribeValue,
} from "../store/store.js"
import "./player-button.js"

export const FULL_SCREEN_WRAPPER_CLASSNAME = "player-controls-fullscreen"

export class PlayerControls extends LitElement {
  static properties = {
    playing: { type: Boolean, state: true },
    isFullscreen: { type: Boolean, state: true },
  }
  constructor() {
    super()
    const unsubscribePlaying = getUnsubscribeValue({
      storeName: STORE_NAMES.PLAYING,
      callback: (playing = true) => (this.playing = playing),
    })
    this.isFullscreen = checkFullscreen()
    const unsubscribeFullscreen = subscribeFullscreen((event) => {
      const isFullscreen = checkFullscreen()
      this.isFullscreen = isFullscreen

      // I tried to avoid video fullscreen button
      // if (!isFullscreen) return
      // // avoid video full

      // const fullScreenElementTagName = event.target.tagName.toLowerCase()
      // const isRightElement = fullScreenElementTagName === "bl-root"
      // if (isRightElement) return


      // this.turnFullscreen(false)
    })

    this.disconnectedCallback = () => {
      unsubscribePlaying()
      unsubscribeFullscreen()
    }
  }
  connectedCallback() {
    super.connectedCallback()
    const fullScreenElement = this.closest(`.${FULL_SCREEN_WRAPPER_CLASSNAME}`)
    this.turnFullscreen = turnFullscreen(fullScreenElement)
  }
  static get styles() {
    return css`
      .controls {
        display: flex;
      }
    `
  }

  render() {
    const { playing, isFullscreen } = this
    return html`
      <div class="controls">
        <player-button
          .click=${setNextPrevActive(true)}
          text="Previous"
          iconName="backward-step"
          first
        ></player-button>
        <player-button
          ?active=${playing}
          .click=${handleSetPlaying(true)}
          text="Play"
          iconName="play"
        ></player-button>
        <player-button
          ?active=${!playing}
          .click=${handleSetPlaying(false)}
          text="Pause"
          iconName="pause"
        ></player-button>
        <player-button
          .click=${setNextPrevActive(false)}
          text="Next"
          iconName="forward-step"
        ></player-button>
        <player-button
          ?active=${isFullscreen}
          .click=${() => this.turnFullscreen()}
          text="Fullscreen"
          iconName=${isFullscreen ? "compress-solid" : "expand-solid"}
          last
        ></player-button>
      </div>
    `
  }
}

customElements.define("player-controls", PlayerControls)
