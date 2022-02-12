const eventBusComment = new Comment("event-bus")

export const subscribe = (eventName, callbackDetail) => {
  const callback = ({ detail }) => callbackDetail(detail)
  eventBusComment.addEventListener(eventName, callback)
  return () => eventBusComment.removeEventListener(eventName, callback)
}

export const emit = (eventName, payload) => {
  eventBusComment.dispatchEvent(new CustomEvent(eventName, { detail: payload }))
}
