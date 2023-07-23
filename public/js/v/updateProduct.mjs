/**
 * @fileOverview  View methods for the use case "update product"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Product from "../m/Product.mjs";
import { fillSelectWithOptions } from "../lib/util.mjs";
import { handleAuthentication } from "./accessControl.mjs";

/***************************************************************
 Setup and handle UI Authentication
 ***************************************************************/
handleAuthentication();

/***************************************************************
 Load data
 ***************************************************************/
const productRecords = await Product.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Product"],
  submitButton = formEl["commit"],
  select = formEl["selectProduct"];

/***************************************************************
 Declare variable to cancel record changes listener, DB-UI sync
 ***************************************************************/
let cancelListener = null;

/***************************************************************
 Fill select element with product
 ***************************************************************/
fillSelectWithOptions(select, productRecords.map((c) => ({ value: c.id.toString(), text: c.name })));

/***************************************************************
 Add change event listener to update form values on selection change
 ***************************************************************/
select.addEventListener("change", async function () {
  if (!select.value) {
    formEl.reset();
    return;
  }
  const productId = select.value;
  const product = await Product.retrieve(select.value);
  if (product) {
    formEl["id"].value = product.id;
    formEl["name"].value = product.name;
    formEl["description"].value = product.description;
    formEl["price"].value = product.price;
    formEl["availabilityStatus"].value = product.availabilityStatus;
    if (cancelListener) cancelListener();
    cancelListener = Product.observeChanges( productId);
  } else {
    formEl.reset();
  }
});

/******************************************************************
 Add event listeners for the create/submit button
 ******************************************************************/
submitButton.addEventListener("click", async function () {
  const slots = {
    id: select.value,
    name: formEl["name"].value,
    description: formEl["description"].value,
    price: formEl["price"].value,
    availabilityStatus: formEl["availabilityStatus"].value
  };
  await Product.update( slots);
  formEl.reset();
});

// set event to cancel DB listener when the browser window/tab is closed
window.addEventListener("beforeunload", function () {
  if (cancelListener) cancelListener();
});

