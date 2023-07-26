/**
 * @fileOverview  View methods for the use case "retrieve and list event"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import { handleAuthentication } from "./accessControl.mjs";
import Event from "../m/Event.mjs";
import Customer from "../m/Customer.mjs";

/***************************************************************
 Setup and handle UI Authentication
 ***************************************************************/
handleAuthentication();

/***************************************************************
 Load data
 ***************************************************************/
const eventRecords = (await Event.retrieveAll()).sort((a,b) => +a.id > +b.id);

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const tableBodyEl = document.querySelector("table#events>tbody");

/***************************************************************
 Render list of all event records
 ***************************************************************/

let page = 0;
let maxPage = Math.ceil(eventRecords.length / 10) - 1;
let visibleEntries = eventRecords.slice(0, 10);

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
  visibleEntries = eventRecords.slice(page * 10, (page+1)*10);
  // for each event, create a table row with a cell for each attribute
  for (const eventRec of visibleEntries) {
    const customers = await Promise.all(eventRec.registeredCustomers.map((c) => Customer.retrieve(c.toString())));
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = eventRec.id;
    row.insertCell().textContent = eventRec.title;
    row.insertCell().textContent = eventRec.description;
    row.insertCell().textContent = new Date(eventRec.date).toLocaleDateString();
    row.insertCell().textContent = customers.map((p) => p.name).join(", ");
  }
}
updateTable();


