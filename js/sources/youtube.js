//https://developers.google.com/youtube/v3/getting-started?hl=es#Sample_Partial_Requests

const YOUTUBE_CLOUD_FUNCTION_URL =
  "https://us-central1-bideolist-44181.cloudfunctions.net/youtube?ids="

export const youtubeFetchVideos = async (id) => {
  if (!id || id.length === 0) return []
  const ids = Array.isArray(id) ? id : [id]
  const url = YOUTUBE_CLOUD_FUNCTION_URL + ids.join(",")
  return fetch(url, { mode: "cors" }).then((res) => res.json())
}
