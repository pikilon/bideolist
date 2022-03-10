export const areEqual = (a, b) =>
  a === b || JSON.stringify(a) === JSON.stringify(b)
