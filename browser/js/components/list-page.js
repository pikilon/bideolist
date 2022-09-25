import { html, css, LitElement } from "lit"
import { classMap } from "lit/directives/class-map.js"
import "./list.js"
import "./list-title.js"
import "./player.js"
import "./progress-bar.js"
import "./bl-search.js"
import { container } from "../../css/utility-classes.css.js"
import "./player-controls.js"
import { navigateToRoot } from "../store/store.js"

export class ListPage extends LitElement {
  static properties = {
    searchOpen: { type: Boolean, state: true },
  }
  static styles = css`
    ${container}
    .player {
      margin-bottom: var(--gap-small);
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
    <a href="../" @click=${navigateToRoot}><img src="browser/images/bideolist_logo.avif" alt="Bideolist logo" /></a>
      <div class="title">
        <bl-list-title></bl-list-title>
      </div>
      
      <slot name="player"></slot>
      <div class="container controls">
        <player-controls></player-controls>
      </div>

      <div class="container progress">
        <progress-bar></progress-bar>
      </div>
      <div class=${classMap({ "container video-list-search": true, searchOpen })}>
        <bl-list></bl-list><bl-search></bl-search>
      </div>
    `
  }
}

customElements.define("list-page", ListPage)
