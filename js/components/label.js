import { html, css, LitElement } from "lit"

export class Label extends LitElement {
  static get styles() {
    return css`
      .label {
        display: inline-block;
        padding: 0.4em 1em;
        border-radius: 0.25em;
        background: var(--color-light);
        color: var(--color-dark);
        background-image: repeating-linear-gradient(
          0,
          var(--color-primary),
          var(--color-primary) 2px,
          transparent 0,
          transparent 2em
        );
      }
      ::slotted(*) {
        margin: 0;
      }
      ::slotted(h1) {
        transform: rotate(-1deg);
        font-size: 1.75em;
        font-family: var(--font-handwriting);
      }
      ::slotted(h2) {
        font-size: 1em;
        text-align: right;
      }
    `
  }

  render() {
    return html`
      <div class="label">
        <slot>Untitled</slot>
      </div>
    `
  }
}

customElements.define("bl-label", Label)
