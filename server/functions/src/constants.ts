type SourceType = {
  [key: string]: {
    ID: string
    SITE: string
    VIDEO_URL: string
  }
}
export const SOURCES: SourceType = {
  YOUTUBE: {
    ID: "yt",
    SITE: "youtube.com",
    VIDEO_URL: "https://www.youtube.com/watch?v=",
  },
  DAILYMOTION: {
    ID: "dm",
    SITE: "dailymotion.com",
    VIDEO_URL: "https://www.dailymotion.com/video/",
  },
  VIMEO: { ID: "vi", SITE: "vimeo.com", VIDEO_URL: "https://vimeo.com/" },
}
