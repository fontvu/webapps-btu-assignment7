/**
 * @fileOverview  View methods for the use case "create event"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import { handleAuthentication } from "./accessControl.mjs";
import Event from "../m/Event.mjs";

/***************************************************************
 Setup and handle UI Authentication
 ***************************************************************/
handleAuthentication();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Event"],
  createButton = formEl["commit"];

/******************************************************************
 Add event listeners for the create/submit button
 ******************************************************************/
createButton.addEventListener("click", async function () {
  const slots = {
    id: formEl["id"].value,
    title: formEl["title"].value,
    description: formEl["description"].value,
    date: formEl["date"].value,
    registeredCustomers: formEl["registeredCustomers"].value.split(",")
  };

  formEl.id.setCustomValidity( await Event.checkIdAsId( slots.id));
  formEl.registeredCustomers.setCustomValidity( await Event.checkRegisteredCustomers( slots.registeredCustomers));
  if ( formEl.checkValidity()) {
    await Event.add( slots);
    formEl.reset();
  }
});

formEl.id.addEventListener("input", function () {
  formEl.id.setCustomValidity( Event.checkId( formEl.id.value));
});
formEl.title.addEventListener("input", function () {
  formEl.title.setCustomValidity( Event.checkTitle( formEl.title.value));
});
formEl.description.addEventListener("input", function () {
  formEl.description.setCustomValidity( Event.checkDescription( formEl.description.value));
});
formEl.date.addEventListener("input", function () {
  formEl.date.setCustomValidity( Event.checkDate( formEl.date.value));
});

