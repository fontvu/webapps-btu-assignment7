/**
 * @fileOverview  View methods for the use case "create product"
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
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Product"],
  createButton = formEl["commit"];

/******************************************************************
 Add event listeners for the create/submit button
 ******************************************************************/
createButton.addEventListener("click", async function () {
  const slots = {
    id: formEl["id"].value,
    name: formEl["name"].value,
    description: formEl["description"].value,
    price: formEl["price"].value,
    availabilityStatus: formEl["availabilityStatus"].value
  };

  formEl.id.setCustomValidity( await Product.checkIdAsId( slots.id));
  if ( formEl.checkValidity()) {
    await Product.add( slots);
    formEl.reset();
  }
});

formEl.id.addEventListener("input", function () {
  formEl.id.setCustomValidity( Product.checkId( formEl.id.value));
});
formEl.name.addEventListener("input", function () {
  formEl.name.setCustomValidity( Product.checkName( formEl.name.value));
});
formEl.description.addEventListener("input", function () {
  formEl.description.setCustomValidity( Product.checkDescription( formEl.description.value));
});
formEl.price.addEventListener("input", function () {
  formEl.price.setCustomValidity( Product.checkPrice( formEl.price.value));
});
formEl.availabilityStatus.addEventListener("input", function () {
  formEl.availabilityStatus.setCustomValidity( Product.checkAvailabilityStatus( formEl.availabilityStatus.value));
});
