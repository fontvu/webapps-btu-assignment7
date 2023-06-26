/**
 * @fileOverview  View methods for the "sign up" button
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import methods and properties
 ***************************************************************/
import { auth } from "../initFirebase.mjs";
import { createUserWithEmailAndPassword, sendEmailVerification }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Auth"],
  signUpBtn = formEl["signUp"];

/******************************************************************
 Add event listeners for the sign-up button
 ******************************************************************/
// manage sign up event
signUpBtn.addEventListener("click", async function () {
  const email = formEl["email"].value,
    password = formEl["password"].value;
  if (email && password) {
    try {
      // create account and get credential by providing email and password
      // user is signed in automatically if the account is created successfully
      const userCredential = await createUserWithEmailAndPassword( auth, email, password);
      // get user reference from Firebase
      const userRef = userCredential.user;
      // send verification email
      await sendEmailVerification( userRef);
      console.log (`User ${email} became "Registered"`);
      alert (`Account created ${email}. Check your email for instructions to verify this account.`);
      window.location.pathname = "/index.html"; // redirect user to start page
    } catch (e) {
      const divMsgEl = document.getElementById("message");
      divMsgEl.textContent = e.message;
      divMsgEl.hidden = false;
    }
  }
});
