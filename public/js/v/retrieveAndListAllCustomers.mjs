/**
 * @fileOverview  View methods for the use case "retrieve and list customers"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import { handleAuthentication } from "./accessControl.mjs";
import Customer from "../m/Customer.mjs";

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
const tableBodyEl = document.querySelector("table#customers>tbody");

/***************************************************************
 Render list of all customer records
 ***************************************************************/
// for each customer, create a table row with a cell for each attribute
for (const customerRec of customerRecords) {
  const row = tableBodyEl.insertRow();
  row.insertCell().textContent = customerRec.id;
  row.insertCell().textContent = customerRec.name;
  row.insertCell().textContent = customerRec.phoneNumber;
}
