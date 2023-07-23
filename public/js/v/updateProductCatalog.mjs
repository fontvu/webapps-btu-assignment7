/**
 * @fileOverview  View methods for the use case "update product catalog"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import ProductCatalog from "../m/ProductCatalog.mjs";
import { fillSelectWithOptions } from "../lib/util.mjs";
import { handleAuthentication } from "./accessControl.mjs";

/***************************************************************
 Setup and handle UI Authentication
 ***************************************************************/
handleAuthentication();

/***************************************************************
 Load data
 ***************************************************************/
const productCatalogRecords = await ProductCatalog.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["ProductCatalog"],
  submitButton = formEl["commit"],
  select = formEl["selectProductCatalog"];

/***************************************************************
 Declare variable to cancel record changes listener, DB-UI sync
 ***************************************************************/
let cancelListener = null;

/***************************************************************
 Fill select element with product catalog
 ***************************************************************/
fillSelectWithOptions(select, productCatalogRecords.map((c) => ({ value: c.id.toString(), text: c.name })));

/***************************************************************
 Add change event listener to update form values on selection change
 ***************************************************************/
select.addEventListener("change", async function () {
  if (!select.value) {
    formEl.reset();
    return;
  }
  const productCatalogId = select.value;
  const productCatalog = await ProductCatalog.retrieve(select.value);
  if (productCatalog) {
    formEl["name"].value = productCatalog.name;
    if (cancelListener) cancelListener();
    cancelListener = ProductCatalog.observeChanges( productCatalogId);
  } else {
    formEl.reset();
  }
});

/******************************************************************
 Add event listeners for the create/submit button
 ******************************************************************/
submitButton.addEventListener("click", async function () {
  const slots = {
    name: formEl["name"].value,
  };
  await ProductCatalog.update( slots);
  formEl.reset();
});

// set event to cancel DB listener when the browser window/tab is closed
window.addEventListener("beforeunload", function () {
  if (cancelListener) cancelListener();
});

