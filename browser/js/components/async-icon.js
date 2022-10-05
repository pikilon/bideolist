import { css, LitElement } from "lit"
import { unsafeSVG } from "lit/directives/unsafe-svg.js"

const PATH_TO_SVGS = "browser/images/icons"

export class AsyncIcon extends LitElement {
  static styles = css`
    svg {
      width: 1em;
      display: block;
      fill: currentColor;
    }
  `
  static properties = {
    name: { type: String },
    svgString: { type: String, state: true },
  }

  fetchSvgString() {
    const url = `${PATH_TO_SVGS}/${this.name}.svg`
    fetch(url)
      .then((res) => res.text())
      .then((svgString) => (this.svgString = svgString))
  }
  updated() {
    this.fetchSvgString()
  }

  render = () => unsafeSVG(this.svgString || "")
}

customElements.define("async-icon", AsyncIcon)
