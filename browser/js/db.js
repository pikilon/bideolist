// can't import as module
import "pouchdb"
import { DEMO_LIST } from "./constants.js"
const { PouchDB } = window

const bideosDb = new PouchDB("bideos")
const listsDb = new PouchDB("lists")

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

export const addListsDB = (list) => {
  const lists = Array.isArray(list) ? list : [list]
  const listsWithId = lists.map((list) => ({
    ...list,
    _id: list._id || new Date().toISOString(),
  }))
  return listsDb.bulkDocs(listsWithId)
}

export const getListsDB = (id) => {
  const list = listsDb.get(id).catch((error) => {
    return { id, error }
  })
  return list
}

const initListsDB = async () => {
  const demoList = await getListsDB(DEMO_LIST._id)
  if (demoList.error) {
    addListsDB(DEMO_LIST)
  }
}
initListsDB()

export const getAllListsDB = async () => {
  const { rows } = await listsDb.allDocs({ include_docs: true })
  const lists = rows.map((row) => row.doc)
  return lists
}

export const getListsMapDB = async () => {
  const allList = await getAllListsDB()
  const listsMap = {}
  for (const list of allList) {
    listsMap[list._id] = list
  }
  return listsMap
}
