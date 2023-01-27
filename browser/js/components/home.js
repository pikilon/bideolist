import { html, css, LitElement } from "lit"
import { container } from "../../css/utility-classes.css.js"
import {
  STORE_NAMES,
  getUnsubscribeValue,
  navigateToList,
} from "../store/store.js"
import { generateListUrlQuery } from "../store/url.js"
import "./label.js"
import "./create-list.js"
import { getAllListsDB, addListsDB } from "../db.js"

export class Home extends LitElement {
  static properties = {
    listsMap: { type: Object, state: true },
    newList: { type: Object, state: true },
    lists: { type: Array, state: true },
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
    this.lists = []
    this.fetchLists()
  }

  fetchLists() {
    getAllListsDB().then((lists) => {
      this.lists = lists
    })
  }

  handleNewListChange = (newList) => {
    const { title, videos } = newList
    this.newList = { title, videos: videos.map(({ composedId }) => composedId) }
  }
  onNewListClick =
    (save = false) =>
    () => {
      if (save) addListsDB(this.newList)
      navigateToList(this.newList)
    }
  get isListReady() {
    return this.newList?.title?.length > 0 && this.newList?.videos?.length > 0
  }
  listClick = (list) => (event) => {
    event.preventDefault()
    navigateToList(list)
  }
  render() {
    const { lists, isListReady } = this
    return html`
      <img src="browser/images/bideolist_logo.avif" alt="Bideolist logo" />
      <div class="container">
        <div class="lists">
          ${lists.map(
            (list) => html`
              <a
                href=${generateListUrlQuery(list)}
                title=${list.title}
                class="list"
                @click=${this.listClick(list)}
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
            Save and go to the list
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
