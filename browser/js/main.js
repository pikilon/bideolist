import { html, css, LitElement } from "lit"
import "./components/list.js"
import "./components/list-title.js"
import "./components/player.js"
import "./components/progress-bar.js"
import { container } from "../css/utility-classes.css.js"

export class MainWrapper extends LitElement {
  static styles = css`
    ${container}
    .player {
      margin-bottom: var(--gap-small);
    }
    .title, .progress {
      margin-bottom: var(--gap-medium);
    }
  `

  render() {
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
      <div class="container video-list">
        <bl-list></bl-list>
      </div>
    `
  }
}

customElements.define("bl-main", MainWrapper)
