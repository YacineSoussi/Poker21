/**
 * Check if element is a string
 * @param {string} target Element to check
 * @returns True or false
 */
export const string = (target) => typeof target === "string";

/**
 * Check if element is a boolean
 * @param {boolean} target Element to check
 * @returns True or false
 */
export const boolean = (target) => typeof target === "boolean";

/**
 * Check if element is a number
 * @param {number} target Element to check
 * @returns True or false
 */
export const number = (target) => typeof target === "number";

/**
 * Check if is an array and check type
 * @param {string | boolean | number | array | object} type Element type
 * @param {array} target Array to check
 * @returns True or false
 */
export const array = (type) => (target) => {
  return Array.isArray(target) && target.every(function(element) {
    return type(element);
  });
};

/**
 * Check all objects and their types
 * @param {string | boolean | number | array | object} types Array of types
 * @param {object} object Specified oject
 * @returns True or false
 */
export const object = (types) => (object) => {
  return types.every(type => {
    return type(object);
  });
};

/**
 * Check property name and his type
 * @param {string} name Property name
 * @param {string | boolean | number | array | object} type Property type
 * @returns True or false
 */
export const property = (name, type) => {
  return object => {
    return type(object[name]);
  };
}