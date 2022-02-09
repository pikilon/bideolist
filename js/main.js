import { html, css, LitElement } from "lit"
import "./components/list.js"
import "./components/list-title.js"

export class MainWrapper extends LitElement {
  static styles = css`
    .container {
      max-width: var(--width-container);
      margin: 0 auto;
    }
    .title {
      margin-bottom: var(--gap-medium);
    }
  `

  render() {
    return html`
      <header class="container title">
        <bl-list-title></bl-list-title>
      </header>
      <div class="container video-list">
        <bl-list></bl-list>
      </div>
    `
  }
}

customElements.define("bl-main", MainWrapper)
