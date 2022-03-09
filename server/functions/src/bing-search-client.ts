import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js"
import { VideoSearchClient } from "@azure/cognitiveservices-videosearch"

const endpoint = "https://api.bing.microsoft.com/v7.0/videos/search"

const apiKey = process.env.BING_API_KEY || "apiKey"

const credentials = new CognitiveServicesCredentials(apiKey)
export const bingClient = new VideoSearchClient(credentials, { endpoint })
