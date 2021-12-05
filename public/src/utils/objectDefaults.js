export const objectDefaults = (obj, defaultObj) => {
  /** initializing return object */
  let returnObj = {}
  if (typeof obj === 'undefined') {
    /** if source object is undefined, load defaults */
    returnObj = defaultObj
  } else if (typeof obj !== typeof defaultObj) {
    /** if source objects type changed, it means changes are major, load source object */
    returnObj = obj
  } else if (obj.constructor === Array) {
    /** if both of them an array, merge arrays */
    returnObj = [...obj, ...defaultObj]
  } else if (typeof obj === 'object') {
    /** if objects are not array and they are objects, ( {etc..} , {etc..}) look up recursively */
    for (const [key, value] of Object.entries(defaultObj)) {
      returnObj[key] = objectDefaults(obj[key], value)
    }
  } else {
    /** value changed, no-need to default value */
    returnObj = obj
  }
  return returnObj
}
