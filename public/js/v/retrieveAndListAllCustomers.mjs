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
import Product from "../m/Product.mjs";
import Event from "../m/Event.mjs";

/***************************************************************
 Setup and handle UI Authentication
 ***************************************************************/
handleAuthentication();

/***************************************************************
 Load data
 ***************************************************************/
const customerRecords = (await Customer.retrieveAll()).sort((a,b) => +a.id > +b.id);

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const tableBodyEl = document.querySelector("table#customers>tbody");

/***************************************************************
 Render list of all customer records
 ***************************************************************/

let page = 0;
let maxPage = Math.ceil(customerRecords.length / 10) - 1;
let visibleEntries = customerRecords.slice(0, 10);

const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");

prevButton.addEventListener("click", function () {
  page--;
  if (page < 0) page = 0;
  updateTable();
});
nextButton.addEventListener("click", function () {
  page++;
  if (page > maxPage) page = maxPage;
  updateTable();
});

async function updateTable() {
  tableBodyEl.innerHTML = "";
  visibleEntries = customerRecords.slice(page * 10, (page+1)*10);
  // for each customer, create a table row with a cell for each attribute
  for (const customerRec of visibleEntries) {
    const products = await Promise.all(customerRec.hasPurchased.map((c) => Product.retrieve(c.toString())));
    const events = await Promise.all(customerRec.registeredEvents.map((c) => Event.retrieve(c.toString())));
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = customerRec.id;
    row.insertCell().textContent = customerRec.name;
    row.insertCell().textContent = customerRec.phoneNumber;
    row.insertCell().textContent = products.map((p) => p.name).join(", ");
    row.insertCell().textContent = events.map((e) => e.title).join(", ");
  }
}
updateTable();


