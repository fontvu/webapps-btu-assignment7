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
 Fill select element with customers
 ***************************************************************/
fillSelectWithOptions(select, customerRecords.map((c) => ({ value: c.id.toString(), text: c.name })));

/***************************************************************
 Add change event listener to update form values on selection change
 ***************************************************************/
select.addEventListener("change", async function () {
  if (!select.value) {
    formEl.reset();
    return;
  }
  console.log('retrieving', select.value);
  const customer = await Customer.retrieve(select.value);
  console.log(customer);
  if (customer) {
    formEl["id"].value = customer.id;
    formEl["name"].value = customer.name;
    formEl["phoneNumber"].value = customer.phoneNumber;
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
