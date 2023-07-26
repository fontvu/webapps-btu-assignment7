/**
 * @fileOverview  View methods for the use case "update event"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Event from "../m/Event.mjs";
import { fillSelectWithOptions } from "../lib/util.mjs";
import { handleAuthentication } from "./accessControl.mjs";

/***************************************************************
 Setup and handle UI Authentication
 ***************************************************************/
handleAuthentication();

/***************************************************************
 Load data
 ***************************************************************/
const eventRecords = await Event.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Event"],
  submitButton = formEl["commit"],
  select = formEl["selectEvent"];

/***************************************************************
 Declare variable to cancel record changes listener, DB-UI sync
 ***************************************************************/
let cancelListener = null;

/***************************************************************
 Fill select element with event
 ***************************************************************/
fillSelectWithOptions(select, eventRecords.map((c) => ({ value: c.id.toString(), text: c.title })));
select.disabled = false;

/***************************************************************
 Add change event listener to update form values on selection change
 ***************************************************************/
select.addEventListener("change", async function () {
  if (!select.value) {
    formEl.reset();
    return;
  }
  const eventId = select.value;
  const event = await Event.retrieve(select.value);
  if (event) {
    formEl["id"].value = event.id;
    formEl["title"].value = event.title;
    formEl["description"].value = event.description;
    formEl["date"].valueAsDate = new Date(event.date);
    formEl["registeredCustomers"].value = event.registeredCustomers;
    if (cancelListener) cancelListener();
    cancelListener = Event.observeChanges( eventId);
  } else {
    formEl.reset();
  }
});

/******************************************************************
 Add event listeners for the create/submit button
 ******************************************************************/
submitButton.addEventListener("click", async function () {
  const slots = {
    id: select.value,
    title: formEl["title"].value,
    description: formEl["description"].value,
    date: formEl["date"].value,
    registeredCustomers: formEl["registeredCustomers"].value.split(",")
  };

  formEl.registeredCustomers.setCustomValidity( await Event.checkRegisteredCustomers( slots.registeredCustomers));
  if ( formEl.checkValidity()) {
    await Event.update( slots);
    formEl.reset();
  }
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

// set event to cancel DB listener when the browser window/tab is closed
window.addEventListener("beforeunload", function () {
  if (cancelListener) cancelListener();
});

