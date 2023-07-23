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
  await Product.add( slots);
  formEl.reset();
});
