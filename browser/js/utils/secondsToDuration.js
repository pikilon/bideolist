export const secondsToDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600).toString()
  const minutes = Math.floor((seconds % 3600) / 60).toString()
  const secondsLeft = (seconds % 60).toString().padStart(2, "0")
  const hoursString = hours > 0 ? `${hours.padStart(2, "0")}:` : ""
  const minutesString = minutes > 0 ? `${minutes.padStart(2, "0")}:` : ""
  return `${hoursString}${minutesString}${secondsLeft}`
}
