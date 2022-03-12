import fetch from "cross-fetch"

const SUPORTED_SITES = ["youtube.com", "vimeo.com", "dailymotion.com"]
const ENCODED_SITES_URL = encodeURI(` site:${SUPORTED_SITES.join(" OR site:")}`)

// "https://www.google.com/search?tbm=vid&q=EXISDANCE+-+Real+time+tracking+%26+Projection+mapping+site%3Ayoutube.com+OR+site%3Avimeo.com+OR+site%3Adailymotion.com"
const URL = "https://www.google.com/search?tbm=vid&q="
export const searchScrapper = async (query: string) => {
  const finalUrl = URL + query + ENCODED_SITES_URL
  const html = await fetch(finalUrl)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const decoder = new TextDecoder("iso-8859-1")
      return decoder.decode(buffer)
    })

  return html
}
