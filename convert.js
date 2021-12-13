const chartToNumber = (char) => char.charCodeAt(0) - 64
const findColIndexReducer = (val, number, index, array) =>
  val + number * 26 ** (array.length - index - 1)

const findColIndex = (input) => {
  const arr = input.toUpperCase().split('').map(chartToNumber)
  return arr.reduce(findColIndexReducer, 0)
}

console.log(findColIndex('aa'))
