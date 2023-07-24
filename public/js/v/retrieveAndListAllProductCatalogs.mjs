/**
 * @fileOverview  View methods for the use case "retrieve and list product catalogs"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import { handleAuthentication } from "./accessControl.mjs";
import ProductCatalog from "../m/ProductCatalog.mjs";
import Product from "../m/Product.mjs";

/***************************************************************
 Setup and handle UI Authentication
 ***************************************************************/
handleAuthentication();

/***************************************************************
 Load data
 ***************************************************************/
const productCatalogRecords = (await ProductCatalog.retrieveAll()).sort((a,b) => +a.name > +b.name);

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const tableBodyEl = document.querySelector("table#productCatalogs>tbody");

/***************************************************************
 Render list of all product catalog records
 ***************************************************************/

let page = 0;
let maxPage = Math.ceil(productCatalogRecords.length / 10) - 1;
let visibleEntries = productCatalogRecords.slice(0, 10);

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
  visibleEntries = productCatalogRecords.slice(page * 10, (page+1)*10);
  // for each product catalog, create a table row with a cell for each attribute
  for (const productCatalogRec of visibleEntries) {
    const products = await Promise.all(productCatalogRec.contains.map((p) => Product.retrieve(p.toString())));
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = productCatalogRec.name;
    row.insertCell().textContent = products.map((p) => p.name).join(", ");
  }
}

updateTable();
