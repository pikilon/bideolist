const fs = require("fs")
const path = require("path")
const { getFilesInFolder } = require("./getFilesInFolder")

const ROOT_PATH = path.join(__dirname, "..")
const BROWSER_PATH = path.join(ROOT_PATH, "browser")
const SERVICE_WORKER_FILE_PATH = path.join(ROOT_PATH, "service-worker.js")

const HTML_PATHS = [
  "index.html",
  "list/index.html",
]


const transformFilenameCallback = (fullPathFilename) => fullPathFilename.replace(ROOT_PATH + "/", "")
const staticFilesList = [...HTML_PATHS, ...getFilesInFolder({ foldersPaths: [BROWSER_PATH], recursive: true, transformFilenameCallback })]

const originalServiceWorkerContent = fs.readFileSync(SERVICE_WORKER_FILE_PATH, { encoding: "utf-8" })

const regexAssetsLine = /const ASSETS = .+/gm;
const finalServiceWorkerContent = originalServiceWorkerContent.replace(regexAssetsLine, `const ASSETS = ${JSON.stringify(staticFilesList)}`)


fs.writeFileSync(SERVICE_WORKER_FILE_PATH, finalServiceWorkerContent, { encoding: "utf-8" })

console.log('Static ASSETS injected on the file:', SERVICE_WORKER_FILE_PATH);