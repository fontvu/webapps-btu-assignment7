/**
 * @fileOverview  View methods for the use case "delete product catalog"
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
 Fill select element with product catalogs
 ***************************************************************/
fillSelectWithOptions(select, productCatalogRecords.map((c) => ({ value: c.id.toString(), text: c.name })));
/*******************************************************************
 Setup listener on the selected product catalog record synchronising DB with UI
 ******************************************************************/
// set up listener to document changes on selected product catalog record
select.addEventListener("change", async function () {
  if (!select.value) {
    formEl.reset();
    return;
  }
  const productCatalog = select.value;
  if (productCatalog) {
    // cancel record listener if a previous listener exists
    if (cancelListener) cancelListener();
    // add listener to selected product catalog, returning the function to cancel listener
    cancelListener = ProductCatalog.observeChanges( productCatalog);
  }
});

/***************************************************************
 Add event listener for the delete/submit button
 ***************************************************************/
submitButton.addEventListener("click", async function () {
  await ProductCatalog.destroy( select.value);
  formEl.reset();
});

// set event to cancel DB listener when the browser window/tab is closed
window.addEventListener("beforeunload", function () {
  if (cancelListener) cancelListener();
});
