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
 Add event listener for the delete/submit button
 ***************************************************************/
submitButton.addEventListener("click", async function () {
  await Customer.destroy( select.value);
  formEl.reset();
});
