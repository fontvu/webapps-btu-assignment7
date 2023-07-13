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
/**
 * Handle messages in modal window for listened change in item
 * @param change: {object}
 */
export function createModalFromChange (change) {
  const { itemName, description, type } = change,
    divModalWindowEl = document.querySelector("#modal-window"),
    divModalContentEl = divModalWindowEl.querySelector("div"),
    pEl = document.createElement("p"),
    btnEl = document.createElement("button");
  divModalContentEl.innerHTML = "";
  pEl.textContent = `The selected ${itemName} "${description}" has been ${type} by another user.`;
  btnEl.type = "button";
  btnEl.textContent = "Reload this page to continue";
  btnEl.addEventListener( "click", () => location.reload());
  divModalContentEl.appendChild( pEl);
  divModalContentEl.appendChild( btnEl);
  divModalWindowEl.appendChild( divModalContentEl);
  divModalWindowEl.classList.add("show-modal");
}

