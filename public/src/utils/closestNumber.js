//arr [10, 25, 50, 75, 100]
//goal 98
export const closestNumber = (goal, arr) =>
  arr.reduce(function (prev, curr) {
      if (goal > prev){
          return curr
      } else return prev
  })
