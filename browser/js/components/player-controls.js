import { html, css, LitElement } from "lit"
import {
  storeSelector,
  STORE_NAMES,
  handleSetPlaying,
  setNextPrevActive,
  getUnsubscribeValue,
} from "../store/store.js"
import "./player-button.js"

export class PlayerControls extends LitElement {
  static properties = {
    playing: { type: Boolean, state: true },
  }
  constructor() {
    super()
    const unsubscribePlaying = getUnsubscribeValue({
      storeName: STORE_NAMES.PLAYING,
      callback: (playing = true) => (this.playing = playing),
    })
    this.disconnectedCallback = () => {
      unsubscribePlaying()
    }
  }
  static get styles() {
    return css`
      .controls {
        display: flex;
      }
    `
  }

  render() {
    const { playing } = this
    return html`
      <div class="controls">
          <player-button .click=${setNextPrevActive(true)} text="Previous" iconName="backward-step" first></player-button>
          <player-button ?active=${playing} .click=${handleSetPlaying(true)} text="Play" iconName="play"></player-button>
          <player-button ?active=${!playing} .click=${handleSetPlaying(false)} text="Pause" iconName="pause"></player-button>
          <player-button .click=${setNextPrevActive(false)} text="Next" iconName="forward-step" last></player-button>
      </div>
    `
  }
}

customElements.define("player-controls", PlayerControls)
