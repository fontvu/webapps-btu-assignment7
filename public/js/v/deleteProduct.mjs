/**
 * @fileOverview  View methods for the use case "delete product"
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
 Fill select element with products
 ***************************************************************/
fillSelectWithOptions(select, productRecords.map((c) => ({ value: c.id.toString(), text: c.name })));
/*******************************************************************
 Setup listener on the selected product record synchronising DB with UI
 ******************************************************************/
// set up listener to document changes on selected product record
select.addEventListener("change", async function () {
  if (!select.value) {
    formEl.reset();
    return;
  }
  const product = select.value;
  if (product) {
    // cancel record listener if a previous listener exists
    if (cancelListener) cancelListener();
    // add listener to selected product, returning the function to cancel listener
    cancelListener = Product.observeChanges( product);
  }
});

/***************************************************************
 Add event listener for the delete/submit button
 ***************************************************************/
submitButton.addEventListener("click", async function () {
  await Product.destroy( select.value);
  formEl.reset();
});

// set event to cancel DB listener when the browser window/tab is closed
window.addEventListener("beforeunload", function () {
  if (cancelListener) cancelListener();
});
