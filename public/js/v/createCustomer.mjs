/**
 * @fileOverview  View methods for the use case "create customer"
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
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Customer"],
  createButton = formEl["commit"];

/******************************************************************
 Add event listeners for the create/submit button
 ******************************************************************/
createButton.addEventListener("click", async function () {
  const slots = {
    id: formEl["id"].value,
    name: formEl["name"].value,
    phoneNumber: formEl["phoneNumber"].value,
    hasPurchased: formEl["hasPurchased"].value.split(",")
  };

  formEl.id.setCustomValidity( await Customer.checkIdAsId( slots.id));
  formEl.hasPurchased.setCustomValidity( await Customer.checkHasPurchased( slots.hasPurchased));
  if ( formEl.checkValidity()) {
    await Customer.add( slots);
    formEl.reset();
  }
});

formEl.id.addEventListener("input", function () {
  formEl.id.setCustomValidity( Customer.checkId( formEl.id.value));
});
formEl.name.addEventListener("input", function () {
  formEl.name.setCustomValidity( Customer.checkName( formEl.name.value));
});
formEl.phoneNumber.addEventListener("input", function () {
  formEl.phoneNumber.setCustomValidity( Customer.checkPhoneNumber( formEl.phoneNumber.value));
});

