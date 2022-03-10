import { html, css, LitElement } from "lit"

const LINK = {
  yt: "https://www.youtube.com/watch?v=",
  dm: "https://www.dailymotion.com/video/",
  vi: "https://vimeo.com/",
}

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
    const link = id ? `${LINK[source]}${id}` : ""
    return link
      ? html`
          <a href="${link}" target="_blank" class="main ${source}">
            ${source}
          </a>
        `
      : html`<span class="main ${source}">${source}</span>`
  }
}

customElements.define("bl-source-icon", SourceIcon)
