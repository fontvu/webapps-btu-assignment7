/**
 * @fileOverview  View methods for the use case "create product catalog"
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
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["ProductCatalog"],
  createButton = formEl["commit"];

/******************************************************************
 Add event listeners for the create/submit button
 ******************************************************************/
createButton.addEventListener("click", async function () {
  const slots = {
    name: formEl["name"].value,
    contains: formEl["contains"].value.split(",")
  };
  
  formEl.name.setCustomValidity( await ProductCatalog.checkNameAsId( slots.name));
  formEl.contains.setCustomValidity( await ProductCatalog.checkContains( slots.contains));
  if ( formEl.checkValidity()) {
    await ProductCatalog.add( slots);
    formEl.reset();
  }
});

formEl.name.addEventListener("input", function () {
  formEl.name.setCustomValidity( ProductCatalog.checkName( formEl.name.value));
});

