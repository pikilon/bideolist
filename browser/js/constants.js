export const SOURCES = {
  YOUTUBE: {
    ID: "yt",
    SITE: "youtube",
    VIDEO_URL: "https://www.youtube.com/watch?v=",
    THUMBNAIL_URL: "https://img.youtube.com/vi/{id}/1.jpg",
  },
  DAILYMOTION: {
    ID: "dm",
    SITE: "dailymotion",
    VIDEO_URL: "https://www.dailymotion.com/video/",
  },
  VIMEO: { ID: "vi", SITE: "vimeo", VIDEO_URL: "https://vimeo.com/", 
  THUMBNAIL_URL: "https://vumbnail.com/{id}_medium.jpg",
},
}

export const SOURCES_BY_ID = {
  [SOURCES.YOUTUBE.ID]: SOURCES.YOUTUBE,
  [SOURCES.VIMEO.ID]: SOURCES.VIMEO,
  [SOURCES.DAILYMOTION.ID]: SOURCES.DAILYMOTION,
}