export const secondsToDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secondsLeft = seconds % 60
  const hoursString = hours > 0 ? `${hours}:` : ""
  const minutesString = minutes > 0 ? `${minutes}:` : ""
  return `${hoursString}${minutesString}${secondsLeft}`
}
