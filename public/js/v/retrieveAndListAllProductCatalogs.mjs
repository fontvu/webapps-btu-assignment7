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

/***************************************************************
 Setup and handle UI Authentication
 ***************************************************************/
handleAuthentication();

/***************************************************************
 Load data
 ***************************************************************/
const productCatalogRecords = await ProductCatalog.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const tableBodyEl = document.querySelector("table#productCatalogs>tbody");

/***************************************************************
 Render list of all product catalog records
 ***************************************************************/
// for each product catalog, create a table row with a cell for each attribute
for (const productCatalogRec of productCatalogRecords) {
  const row = tableBodyEl.insertRow();
  row.insertCell().textContent = productCatalogRec.name;
}
