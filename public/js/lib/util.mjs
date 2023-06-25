/*
 * Creates an option element
 * @param value: {string}
 * @param text: {string}
 */
function createOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.text = text;
  return option;
}

/*
 * Fills a select element with options
 * @param element: {HTMLSelectElement}
 * @param options: {Array<{ value: string, text: string }>}
 */
export function fillSelectWithOptions(element, options) {
  element.append(createOption("", " --- "));
  for (const { value, text } of options) {
    element.append(createOption(value, text));
  }
}
