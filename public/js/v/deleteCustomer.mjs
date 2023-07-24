/**
 * @fileOverview  View methods for the use case "delete customer"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Customer from "../m/Customer.mjs";
import { fillSelectWithOptions } from "../lib/util.mjs";
import { handleAuthentication } from "./accessControl.mjs";

/***************************************************************
 Setup and handle UI Authentication
 ***************************************************************/
handleAuthentication();

/***************************************************************
 Load data
 ***************************************************************/
const customerRecords = await Customer.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Customer"],
  submitButton = formEl["commit"],
  select = formEl["selectCustomer"];


/***************************************************************
 Declare variable to cancel record changes listener, DB-UI sync
 ***************************************************************/
let cancelListener = null;

/***************************************************************
 Fill select element with customers
 ***************************************************************/
fillSelectWithOptions(select, customerRecords.map((c) => ({ value: c.id.toString(), text: c.name })));
select.disabled = false;

/*******************************************************************
 Setup listener on the selected customer record synchronising DB with UI
 ******************************************************************/
// set up listener to document changes on selected customer record
select.addEventListener("change", async function () {
  if (!select.value) {
    formEl.reset();
    return;
  }
  const customer = select.value;
  if (customer) {
    // cancel record listener if a previous listener exists
    if (cancelListener) cancelListener();
    // add listener to selected customer, returning the function to cancel listener
    cancelListener = Customer.observeChanges( customer);
  }
});

/***************************************************************
 Add event listener for the delete/submit button
 ***************************************************************/
submitButton.addEventListener("click", async function () {
  await Customer.destroy( select.value);
  formEl.reset();
});

// set event to cancel DB listener when the browser window/tab is closed
window.addEventListener("beforeunload", function () {
  if (cancelListener) cancelListener();
});
