import { html, css, LitElement } from "lit"
import { container } from "../../css/utility-classes.css.js"
import { STORE_NAMES, upsertList, getUnsubscribeValue } from "../store/store.js"
import { generateListUrlQuery } from "../store/url.js"
import "./label.js"
import "./create-list.js"

export class Home extends LitElement {
  static properties = {
    lists: { type: Array, state: true },
  }
  static styles = css`
    ${container}
    .lists {
      margin: var(--gap-medium) 0;
    }
    a + a {
      margin-top: var(--gap-medium);
    }
  `
  constructor() {
    super()
    const unsubscribeLists = getUnsubscribeValue({
      storeName: STORE_NAMES.LISTS,
      callback: (lists) => (this.lists = Object.values(lists)),
    })

    this.disconnectedCallback = () => {
      unsubscribeLists()
    }
  }
  render() {
    const { lists } = this
    return html`
      <div class="container">
        <div class="lists">
          ${lists.map(
            (list) => html`
              <a
                href=${`list/${generateListUrlQuery(list)}`}
                title=${list.title}
              >
                <bl-label><h1>${list.title}</h1></bl-label>
              </a>
            `
          )}
        </div>
        <div class="new-list">
          <create-list></create-list>
        </div>
      </div>
    `
  }
}

customElements.define("bl-home", Home)
