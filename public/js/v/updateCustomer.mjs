/**
 * @fileOverview  View methods for the use case "update customer"
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

/***************************************************************
 Add change event listener to update form values on selection change
 ***************************************************************/
select.addEventListener("change", async function () {
  if (!select.value) {
    formEl.reset();
    return;
  }
  const customerId = select.value;
  const customer = await Customer.retrieve(select.value);
  if (customer) {
    formEl["id"].value = customer.id;
    formEl["name"].value = customer.name;
    formEl["phoneNumber"].value = customer.phoneNumber;
    if (cancelListener) cancelListener();
    cancelListener = Customer.observeChanges( customerId);
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
    phoneNumber: formEl["phoneNumber"].value
  };
  await Customer.update( slots);
  formEl.reset();
});

// set event to cancel DB listener when the browser window/tab is closed
window.addEventListener("beforeunload", function () {
  if (cancelListener) cancelListener();
});

