/**
 * A helper method to set more than one CSS attribute for a JS element at once
 * @param {HTMLElement} element - the element to set attributes for
 * @param {Object} attributes - an object containing CSS properties to value mappings
 */
export function setAttributes(element, attributes) {
  for (const prop in attributes) {
    element.setAttribute(prop, attributes[prop])
  }
}
