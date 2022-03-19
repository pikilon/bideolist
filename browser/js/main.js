import { html, css, LitElement } from "lit"
import { classMap } from "lit/directives/class-map.js"
import "./components/list.js"
import "./components/list-title.js"
import "./components/player.js"
import "./components/progress-bar.js"
import "./components/bl-search.js"
import { container } from "../css/utility-classes.css.js"


export class MainWrapper extends LitElement {
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
  `
  constructor() {
    super()
    this.searchOpen = true
  }

  render() {
    const { searchOpen } = this
    return html`
      <div class="title">
        <bl-list-title></bl-list-title>
      </div>
      <div class="player">
        <bl-player></bl-player>
      </div>
      <div class="container progress">
        <progress-bar></progress-bar>
      </div>
      <div class=${classMap({"container video-list-search": true, searchOpen })}>
        <bl-list></bl-list><bl-search></bl-search>
      </div>
    `
  }
}

customElements.define("bl-main", MainWrapper)
