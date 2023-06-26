/**
 * @fileOverview  View methods for the "sign in" button
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import methods and properties
 ***************************************************************/
import { auth } from "../initFirebase.mjs";
import { signInWithEmailAndPassword }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Auth"],
  signInBtn = formEl["signIn"];

/******************************************************************
 Add event listeners for the sign-in button
 ******************************************************************/
signInBtn.addEventListener("click", async function () {
  const email = formEl["email"].value,
    password = formEl["password"].value;
  if (email && password) {
    try {
      // sign in user using email + password
      await signInWithEmailAndPassword( auth, email, password);
      window.location.pathname = "/index.html"; // redirect user to start page
    } catch (e) {
      const divMsgEl = document.getElementById("message");
      divMsgEl.textContent = e.message;
      divMsgEl.hidden = false;
    }
  }
});