import { css, html, LitElement } from "lit"
import "./async-icon.js"

export class LoadingSpinner extends LitElement {
  static styles = css`
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    async-icon {
      display: inline-block;
      animation: spin 1s linear infinite;
    }
  `
  render = () => html` <async-icon name="spinner"></async-icon>`
}

customElements.define("loading-spinner", LoadingSpinner)
