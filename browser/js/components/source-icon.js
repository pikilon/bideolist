import { html, css, LitElement } from "lit"
import { SOURCES_BY_ID } from "../constants.js"
import "./async-icon.js"

export class SourceIcon extends LitElement {
  static properties = {
    source: { type: String },
    id: { type: String },
  }
  static styles = css`
    .main {
      font-size: 0.8em;
      --size: 2.2em;
      display: flex;
      color: white;
      width: var(--size);
      height: var(--size);
      border-radius: 100%;
      align-items: center;
      justify-content: center;
      text-decoration: none;
    }
    .yt {
      background-color: var(--color-youtube);
    }
    .dm {
      background-color: var(--color-dailymotion);
    }
    .vi {
      background-color: var(--color-vimeo);
    }
  `
  render() {
    const { source, id } = this
    const link = id ? `${SOURCES_BY_ID?.[source].VIDEO_URL}${id}` : ""
    const iconName = SOURCES_BY_ID?.[source].SITE || "youtube"
    return link
      ? html`
          <a href="${link}" target="_blank" class="main ${source}">
            <async-icon name=${iconName}></async-icon>
          </a>
        `
      : html`<span class="main ${source}">${source}</span>`
  }
}

customElements.define("bl-source-icon", SourceIcon)
