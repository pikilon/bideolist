import { html, css, LitElement } from "lit"

class ProgressBar extends LitElement {
  static properties = {
    total: { type: Number },
    done: { type: Number },
  }
  static styles = css`
    .background {
      height: var(--gap-small);
      background-color: var(--color-light-gray);
    }
    .progress {
      height: 100%;
      width: var(--progress-bar-width);
      background-color: var(--color-primary);
    }
  `

  get donePercentage() {
    const { total = 100, done } = this
    const percentage = (done / total) * 100
    const percentageFixed = percentage.toFixed(2)
    return percentageFixed
  }

  applyDonePercentage() {
    const { donePercentage } = this
    this.style.setProperty("--progress-bar-width", `${donePercentage}%`)
  }

  // In order to avoid re-rendering 
  // we just update the css variable on the dom
  shouldUpdate(changedProperties) {
    if (changedProperties.has("done")) {
      this.applyDonePercentage()
    }
    const shouldUpdate = changedProperties.has("total")
    return shouldUpdate
  }

  render() {
    return html`
      <div class="background">
        <div class="progress"></div>
      </div>
    `
  }
}

customElements.define("progress-bar", ProgressBar)
