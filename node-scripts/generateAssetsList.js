const fs = require("fs")
const path = require("path")
const { getFilesInFolder } = require("./getFilesInFolder")

const ROOT_PATH = path.join(__dirname, "..")
const BROWSER_PATH = path.join(ROOT_PATH, "browser")
const GENERATED_ASSETS_LIST_FILE = path.join(ROOT_PATH, "generated-assets-list-module.js")

const HTML_PATHS = [
  "index.html",
  "list/index.html",
  "https://unpkg.com/lit/index.js?module",
  "https://unpkg.com/lit/directives/if-defined.js?module",
  "https://cdn.jsdelivr.net/gh/pikilon/react-player@dist-file-temporal/dist/ReactPlayer.standalone-module.js",
  "https://unpkg.com/lit/directives/class-map.js?module",
  "https://unpkg.com/lit/directives/unsafe-svg.js?module",
  "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js",
  "https://www.gstatic.com/firebasejs/9.6.8/firebase-functions.js",
  "https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Roboto:wght@400;900&family=Special+Elite&display=swap",
]


const transformFilenameCallback = (fullPathFilename) => fullPathFilename.replace(ROOT_PATH + "/", "")
const staticFilesList = [...HTML_PATHS, ...getFilesInFolder({ foldersPaths: [BROWSER_PATH], recursive: true, transformFilenameCallback })]

const finalContent = `
// This file is genereated by node-scripts/generateAssetsList.js
export default ${JSON.stringify(staticFilesList)}
`

fs.writeFileSync(GENERATED_ASSETS_LIST_FILE, finalContent, { encoding: "utf-8" })

console.log('Static ASSETS injected on the file:', GENERATED_ASSETS_LIST_FILE);