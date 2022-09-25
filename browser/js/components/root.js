import { html, css, LitElement } from "lit"
import "./home.js"
import "./list-page.js"
import "./player.js"
import { ROUTES } from "../store/url.js"
import { getUnsubscribeValue, STORE_NAMES } from "../store/store.js"

const ROUTER = {
  [ROUTES.ROOT]:  html`<bl-home></bl-home>`,
  [ROUTES.LIST]: html`<list-page><slot slot="player" name="player"></slot></list-page>`,
  404: html`<h1>404</h1>`,
}

ROUTER[ROUTES.ROOT_INDEX] = ROUTER[ROUTES.ROOT]


class Root extends LitElement {
  static properties = { route: { type: String, state: true } }
  constructor() {
    super()
    this.unsubscribeRoute = getUnsubscribeValue({
      storeName: STORE_NAMES.ROUTE,
      callback: (route) => (this.route = route),
    })
  }
  render() {
    const route = ROUTER[this.route] || ROUTER[404]
    return route
  }
}

customElements.define("bl-root", Root)
