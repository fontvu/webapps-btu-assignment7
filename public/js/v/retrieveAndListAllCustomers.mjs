/**
 * @fileOverview  View methods for the use case "retrieve and list books"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Customer from "../m/Customer.mjs";

/***************************************************************
 Load data
 ***************************************************************/
const customerRecords = await Customer.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const tableBodyEl = document.querySelector("table#customers>tbody");

/***************************************************************
 Render list of all book records
 ***************************************************************/
// for each book, create a table row with a cell for each attribute
for (const customerRec of customerRecords) {
  const row = tableBodyEl.insertRow();
  row.insertCell().textContent = customerRec.id;
  row.insertCell().textContent = customerRec.name;
  row.insertCell().textContent = customerRec.phoneNumber;
}
