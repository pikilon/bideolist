import { html, css, LitElement } from "lit"
import { classMap } from "lit/directives/class-map.js"

import "./async-icon.js"

export class PlayerButton extends LitElement {
  static properties = {
    click: { type: Function },
    text: { type: String },
    iconName: { type: String },
    active: { type: Boolean },
    first: { type: Boolean },
    last: { type: Boolean },
    
  }
  static get styles() {
    return css`
      .button {
        background-color: var(--color-light);
        border: 0;
        display: flex;
        align-items: flex-end;
        height: 3em;
        transition: all 0.2s;
        box-shadow: inset 0 0 0 1px rgb(0 0 0 / 20%),
                    inset 0 0 1px 2px rgb(255 255 255 / 90%),
                    inset 0 -6px 5px rgb(0 0 0 / 10%),
                    0 6px 7px rgb(0 0 0 / 30%),
                    0 4px 1px rgb(0 0 0 / 50%);
      }
      .pressed {
        box-shadow: inset 0 0 0 1px rgb(0 0 0 / 20%),
                    inset 0 0 5px 1px rgb(0 0 0 / 50%),
                    inset 0 -10px 15px rgb(0 0 0 / 20%),
                    0 7px 5px rgb(0 0 0 / 50%);
      }
      .button:active {
        box-shadow: inset 0 0 0 1px rgb(0 0 0 / 18%),
                    inset 0 0 1px 2px rgb(0 0 0 / 50%),
                    inset 0 -6px 5px rgb(0 0 0 / 10%),
                    0 6px 7px rgb(0 0 0 / 30%),
                    0 2px 1px rgb(0 0 0 / 50%);
      }
      .first {
        border-radius: 5px 0 0 5px;
      }
      .last {
        border-radius: 0 5px 5px 0;
      }
      .text {
        display: inline-block;
        text-transform:capitalize;
        margin-left: var(--gap-small);
      }
    `
  }

  render() {
    const { click, text, iconName, active, first, last } = this
    const className = classMap({ button: true, pressed: active, first, last })
    return html`
      <button class=${className} @click=${click}>
        <async-icon name=${iconName}></async-icon>
        <span class="text">${text}</span>
      </button>
    `
  }
}

customElements.define("player-button", PlayerButton)
