import { css, html, LitElement } from "lit"
import "./async-icon.js"

export class LoadingSpinner extends LitElement {
  static styles = css`
    @keyframes spin{
      to { transform: rotate(360deg); }
    }
    div {
      display: inline-block;
      font-size: 3em;
      animation: spin 1s linear infinite;
    }
  `
  render = () => html` <div><async-icon name="spinner"></async-icon></div>`
}

customElements.define("loading-spinner", LoadingSpinner)
