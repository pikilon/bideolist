import { html, css, LitElement } from "lit"
import "./home.js"
import "./list-page.js"
import "./player.js"


const cleanPathname = () => {
  const withoutGithubSubfolder = window.location.pathname.replace(/bideolist\//, "")
  const result = withoutGithubSubfolder.replace(/\/$/, "")
  return result.length > 0 ? result : "/"

}

const ROUTES = {
  ROOT: "/",
  ROOT_INDEX: "/index.html",
  LIST: "/list",
}
const ROUTER = {
  [ROUTES.ROOT]:  html`<bl-home></bl-home>`,
  [ROUTES.LIST]: html`<list-page><slot slot="player" name="player"></slot></list-page>`,
  404: html`<h1>404</h1>`,
}

ROUTER[ROUTES.ROOT_INDEX] = ROUTER[ROUTES.ROOT]


class Root extends LitElement {
  render() {
    const pathname = cleanPathname()
    const route = ROUTER[pathname] || ROUTER[404]
    return route
  }
}

customElements.define("bl-root", Root)
