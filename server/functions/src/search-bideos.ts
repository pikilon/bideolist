import { createWriteStream } from "fs"
import fetch from "cross-fetch"

const doSearch = async () => {
  const URL =
    "https://www.google.com/search?tbm=vid&q=qwVyOGkGtko"
  const response = await fetch(URL)
  const html = await response.text()
  console.log('html', html);
  createWriteStream("/tmp/google.html").write(html)
}

doSearch()
