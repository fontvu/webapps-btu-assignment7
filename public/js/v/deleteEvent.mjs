/**
 * @fileOverview  View methods for the use case "delete event"
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

/*******************************************************************
 Setup listener on the selected event record synchronising DB with UI
 ******************************************************************/
// set up listener to document changes on selected event record
select.addEventListener("change", async function () {
  if (!select.value) {
    formEl.reset();
    return;
  }
  const event = select.value;
  if (event) {
    // cancel record listener if a previous listener exists
    if (cancelListener) cancelListener();
    // add listener to selected event, returning the function to cancel listener
    cancelListener = Event.observeChanges( event);
  }
});

/***************************************************************
 Add event listener for the delete/submit button
 ***************************************************************/
submitButton.addEventListener("click", async function () {
  await Event.destroy( select.value);
  formEl.reset();
});

// set event to cancel DB listener when the browser window/tab is closed
window.addEventListener("beforeunload", function () {
  if (cancelListener) cancelListener();
});
