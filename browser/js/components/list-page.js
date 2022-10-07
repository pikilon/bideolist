import { html, css, unsafeCSS, LitElement } from "lit"
import { classMap } from "lit/directives/class-map.js"
import "./list.js"
import "./list-title.js"
import "./player.js"
import "./progress-bar.js"
import "./bl-search.js"
import { container } from "../../css/utility-classes.css.js"
import { FULL_SCREEN_WRAPPER_CLASSNAME } from "./player-controls.js"
import { navigateToRoot } from "../store/store.js"

const fullScreenWrapperClass = unsafeCSS(FULL_SCREEN_WRAPPER_CLASSNAME)
export class ListPage extends LitElement {
  static properties = {
    searchOpen: { type: Boolean, state: true },
  }
  static styles = css`
    ${container}
    .${fullScreenWrapperClass} {
      display: flex;
      gap: 1rem;
      aspect-ratio: 16 / 9;
      flex-direction: column;
      justify-content: space-evenly;
    }
    .title,
    .progress {
      margin-bottom: var(--gap-medium);
    }
    .video-list-search {
      display: flex;
    }
    .video-list-search.searchOpen {
      max-width: 80rem;
    }
    .controls {
      flex: 0;
      display: flex;
      justify-content: center;
      margin-bottom: var(--gap-medium);
    }
  `
  constructor() {
    super()
    this.searchOpen = true
  }

  render() {
    const { searchOpen } = this
    return html`
      <a href="../" @click=${navigateToRoot}
        ><img src="browser/images/bideolist_logo.avif" alt="Bideolist logo"
      /></a>
      <div class="title">
        <bl-list-title></bl-list-title>
      </div>

      <div class="${FULL_SCREEN_WRAPPER_CLASSNAME}">
        <slot name="player"></slot>
        <div class="container controls">
          <player-controls></player-controls>
        </div>
      </div>

      <div class="container progress">
        <progress-bar></progress-bar>
      </div>
      <div
        class=${classMap({ "container video-list-search": true, searchOpen })}
      >
        <bl-list></bl-list><bl-search></bl-search>
      </div>
    `
  }
}

customElements.define("list-page", ListPage)
