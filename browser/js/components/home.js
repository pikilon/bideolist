import { html, css, LitElement } from "lit"
import { STORE_NAMES, upsertList, getUnsubscribeValue } from "../store/store.js"
import "./label.js"

export class Home extends LitElement {
  static properties = {
    lists: { type: Array, state: true },
  }
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
    console.log('lists', lists);
    return html`
      <div class="container">
        <label>Home</label>
        <ul>
          ${lists.map((list) => html` <li>${list.title}</li> `)}
        </ul>
      </div>
    `
  }
}

customElements.define("bl-home", Home)
