import { html, css, LitElement } from "lit"
import { container } from "../../css/utility-classes.css.js"
import { STORE_NAMES, upsertList, getUnsubscribeValue } from "../store/store.js"
import { generateListUrlQuery } from "../store/url.js"
import "./label.js"
import "./create-list.js"

export class Home extends LitElement {
  static properties = {
    listsMap: { type: Object, state: true },
    newList: { type: Object, state: true },
  }
  static styles = css`
    ${container}
    .lists {
      margin: var(--gap-medium) 0;
    }
    .list {
      display: block;
    }
    .list + .list {
      margin-top: var(--gap-medium);
    }
  `
  constructor() {
    super()
    const unsubscribeLists = getUnsubscribeValue({
      storeName: STORE_NAMES.LISTS,
      callback: (listsMap) => (this.listsMap = listsMap),
    })

    this.disconnectedCallback = () => {
      unsubscribeLists()
    }
  }
  get lists() {
    return Object.values(this.listsMap)
  }
  handleNewListChange = (newList) => {
    this.newList = newList
  }
  onNewListClick =
    (save = false) =>
    () => {
      const { title } = this.newList
      const videos = this.newList.videos.map(({ composedId }) => composedId)
      const finalList = { title, videos }
      const url = `list/${generateListUrlQuery(finalList)}`
      if (save) upsertList(this.newList)
      window.location.href = url
    }
  get isListReady() {
    return this.newList?.title?.length > 0 && this.newList?.videos?.length > 0
  }
  render() {
    const { lists, isListReady } = this
    return html`
      <div class="container">
        <div class="lists">
          ${lists.map(
            (list) => html`
              <a
                href=${`list/${generateListUrlQuery(list)}`}
                title=${list.title}
                class="list"
              >
                <bl-label><h1>${list.title}</h1></bl-label>
              </a>
            `
          )}
        </div>
        <div class="new-list">
          <h1>Create a new list</h1>
          <create-list .change=${this.handleNewListChange}></create-list>
          <button ?disabled=${!isListReady} @click=${this.onNewListClick(true)}>
            Save and go
          </button>
          <button
            ?disabled=${!isListReady}
            @click=${this.onNewListClick(false)}
          >
            go
          </button>
        </div>
      </div>
    `
  }
}

customElements.define("bl-home", Home)
