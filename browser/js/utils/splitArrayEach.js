export const splitArrayEach = (array, splitEach) => {
  const splitArray = []
  for (let i = 0; i < array.length; i += splitEach) {
    const currentArray = array.slice(i, i + splitEach)
    splitArray.push(currentArray)
  }
  return splitArray
}
