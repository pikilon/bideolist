import { html, css, LitElement } from "lit"
import "./components/list.js"

export class MainWrapper extends LitElement {
  static styles = css`
    .video-list {
      max-width: var(--width-container);
      margin: 0 auto;
    }
  `

  render() {

    return html`
      <p>Bideolist!</p>
      <div class="video-list">
        <bl-list ></bl-list>
      </div>
    `
  }
}

customElements.define("bl-main", MainWrapper)
