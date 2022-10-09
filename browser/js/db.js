// can't import as module
import "pouchdb"
const { PouchDB } = window

const bideosDb = new PouchDB("bideos")

export const addBideosDB = (bideo) => {
  const bideos = Array.isArray(bideo) ? bideo : [bideo]
  const bideosWithId = bideos.map((bideo) => ({
    ...bideo,
    _id: bideo.composedId,
  }))
  return bideosDb.bulkDocs(bideosWithId)
}

export const getBideoDB = (id) => {
  return bideosDb.get(id).catch((error) => {
    return { id, error }
  })
}
export const getBideosMapDB = async (ids) => {
  const allDocs = bideosDb.allDocs({ keys: ids, include_docs: true })
  const { rows } = await allDocs
  const bideosMap = {}
  for (const { doc } of rows) {
    if (doc?.composedId) bideosMap[doc.composedId] = doc
  }
  return bideosMap
}
