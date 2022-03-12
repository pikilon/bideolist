import { html, css, LitElement } from "lit"
import { search } from "../api/search.js"

export class Search extends LitElement {
  static styles = css``

  constructor() {
    super()
  }
  handleClick() {
    search("Búscate la vida Chris Elliott Get a Life")
  }

  render() {
    return html`
      <div>
        <button @click=${this.handleClick}>search</button>
      </div>
    `
  }
}

customElements.define("bl-search", Search)
