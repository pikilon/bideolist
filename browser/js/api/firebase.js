import { initializeApp } from "firebase/app"
import { getFunctions, httpsCallable  } from "firebase/functions"
import { FIREBASE_CONFIG } from "../../config.js"

const app = initializeApp(FIREBASE_CONFIG)

const firebaseFunctions = getFunctions(app)
export const getYoutubeInfo = httpsCallable(firebaseFunctions, "youtube")
