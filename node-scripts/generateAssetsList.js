const fs = require("fs")
const path = require("path")
const { getFilesInFolder } = require("./getFilesInFolder")

const ROOT_PATH = path.join(__dirname, "..")
const BROWSER_PATH = path.join(ROOT_PATH, "browser")
const GENERATED_ASSETS_LIST_FILE = path.join(ROOT_PATH, "generated-assets-list-module.js")

const HTML_PATHS = [
  "https://cdn.jsdelivr.net/gh/pikilon/react-player@dist-file-temporal/dist/ReactPlayer.standalone-module.js",
  "https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Roboto:wght@400;900&family=Special+Elite&display=swap",
  "https://fonts.gstatic.com/s/permanentmarker/v10/Fh4uPib9Iyv2ucM6pGQMWimMp004La2Cfw.woff2",
  "https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmYUtfBBc4.woff2",
  "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxK.woff2",
  "https://unpkg.com/@lit/reactive-element@%5E1.3.0?module",
  "https://unpkg.com/@lit/reactive-element@1.3.1/css-tag.js?module",
  "https://unpkg.com/lit-element@%5E3.2.0/lit-element.js?module",
  "https://unpkg.com/lit-html@%5E2.2.0?module",
  "https://unpkg.com/lit-html@%5E2.2.0/directives/class-map.js?module",
  "https://unpkg.com/lit-html@%5E2.2.0/directives/unsafe-svg.js?module",
  "https://unpkg.com/lit-html@2.2.2/directive.js?module",
  "https://unpkg.com/lit-html@2.2.2/directives/unsafe-html.js?module",
  "https://unpkg.com/lit-html@2.2.2/lit-html.js?module",
  "https://unpkg.com/lit/directives/class-map.js?module",
  "https://unpkg.com/lit/directives/if-defined.js?module",
  "https://unpkg.com/lit/directives/unsafe-svg.js?module",
  "https://unpkg.com/lit/index.js?module",
  "https://unpkg.com/react-player@2.10.0/dist/ReactPlayer.standalone.js",
  // "https://www.youtube.com/s/player/689586e2/www-widgetapi.vflset/www-widgetapi.js",
  // "https://www.youtube.com/iframe_api",
  "https://player.vimeo.com/api/player.js",
  "https://api.dmcdn.net/all.js",
  "index.html",
  "list/index.html",
  "/",
  "/list",
]



const transformFilenameCallback = (fullPathFilename) => {
  const isSvgFromGithub = fullPathFilename.includes("/browser/images/icons/")
  const replaceWith = isSvgFromGithub ? "https://raw.githubusercontent.com/pikilon/bideolist/master" : ""
  return fullPathFilename.replace(ROOT_PATH, replaceWith)
}
const staticFilesList = [...HTML_PATHS, ...getFilesInFolder({ foldersPaths: [BROWSER_PATH], recursive: true, transformFilenameCallback })]

const finalContent = `
// This file is genereated by node-scripts/generateAssetsList.js
export default ${JSON.stringify(staticFilesList, null, 4)}
`

fs.writeFileSync(GENERATED_ASSETS_LIST_FILE, finalContent, { encoding: "utf-8" })

console.log('Static ASSETS injected on the file:', GENERATED_ASSETS_LIST_FILE);