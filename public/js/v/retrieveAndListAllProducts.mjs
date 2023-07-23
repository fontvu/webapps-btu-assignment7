/**
 * @fileOverview  View methods for the use case "retrieve and list product"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import { handleAuthentication } from "./accessControl.mjs";
import Product from "../m/Product.mjs";

/***************************************************************
 Setup and handle UI Authentication
 ***************************************************************/
handleAuthentication();

/***************************************************************
 Load data
 ***************************************************************/
const productRecords = (await Product.retrieveAll()).sort((a,b) => +a.id > +b.id);

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const tableBodyEl = document.querySelector("table#products>tbody");

/***************************************************************
 Render list of all product records
 ***************************************************************/

let page = 0;
let maxPage = Math.ceil(productRecords.length / 10) - 1;
let visibleEntries = productRecords.slice(0, 10);

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

function updateTable() {
  tableBodyEl.innerHTML = "";
  visibleEntries = productRecords.slice(page * 10, (page+1)*10);
  // for each product, create a table row with a cell for each attribute
  for (const productRec of visibleEntries) {
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = productRec.id;
    row.insertCell().textContent = productRec.name;
    row.insertCell().textContent = productRec.description;
    row.insertCell().textContent = productRec.price;
    row.insertCell().textContent = productRec.availabilityStatus;
  }
}

updateTable();
