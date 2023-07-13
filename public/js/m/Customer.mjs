/**
 * @fileOverview  The model class Customer with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @copyright Copyright 2020-2022 Gerd Wagner (Chair of Internet Technology) and Juan-Francisco Reyes,
 * Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
import { fsDb } from "../initFirebase.mjs";
import { collection as fsColl, deleteDoc, doc as fsDoc, getDoc, getDocs, setDoc, updateDoc, onSnapshot }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { createModalFromChange } from "../lib/util.mjs";

/**
 * Constructor function for the class Customer
 * @constructor
 * @param {{id: string, name: string, phoneNumber: number}} slots - Object creation slots.
 */
class Customer {
  // record parameter with the ES6 syntax for function parameter destructuring
  constructor({id, name, phoneNumber}) {
    this.id = id;
    this.name = name;
    this.phoneNumber = phoneNumber;
  }
}
/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
/**
 * Create a Firestore document in the Firestore collection "customers"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Customer.add = async function (slots) {
  const customersCollRef = fsColl( fsDb, "customers"),
    customerDocRef = fsDoc (customersCollRef, slots.id);
  try {
    await setDoc( customerDocRef, slots);
    console.log(`Customer record ${slots.id} created.`);
  } catch( e) {
    console.error(`Error when adding customer record: ${e}`);
  }
};
/**
 * Load a customer record from Firestore
 * @param id: {object}
 * @returns {Promise<*>} customerRecord: {array}
 */
Customer.retrieve = async function (id) {
  let customerDocSn = null;
  try {
    const customerDocRef = fsDoc( fsDb, "customers", id);
    customerDocSn = await getDoc( customerDocRef);
  } catch( e) {
    console.error(`Error when retrieving customer record: ${e}`);
    return null;
  }
  const customerRec = customerDocSn.data();
  return customerRec;
};
/**
 * Load all customer records from Firestore
 * @returns {Promise<*>} customerRecords: {array}
 */
Customer.retrieveAll = async function () {
  let customersQrySn = null;
  try {
    const customersCollRef = fsColl( fsDb, "customers");
    customersQrySn = await getDocs( customersCollRef);
  } catch( e) {
    console.error(`Error when retrieving customer records: ${e}`);
    return null;
  }
  const customerDocs = customersQrySn.docs,
    customerRecs = customerDocs.map( d => d.data());
  console.log(`${customerRecs.length} customer records retrieved.`);
  return customerRecs;
};
/**
 * Update a Firestore document in the Firestore collection "customers"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Customer.update = async function (slots) {
  const updSlots = {};
  // retrieve up-to-date customer record
  const customerRec = await Customer.retrieve( slots.id);
  // update only those slots that have changed
  if (customerRec.name !== slots.name) updSlots.name = slots.name;
  if (customerRec.phoneNumber !== slots.phoneNumber) updSlots.phoneNumber = slots.phoneNumber;
  if (Object.keys( updSlots).length > 0) {
    try {
      const customerDocRef = fsDoc( fsDb, "customers", slots.id);
      await updateDoc( customerDocRef, updSlots);
      console.log(`Customer record ${slots.id} modified.`);
    } catch( e) {
      console.error(`Error when updating customer record: ${e}`);
    }
  }
};
/**
 * Delete a Firestore document from the Firestore collection "customers"
 * @param id: {string}
 * @returns {Promise<void>}
 */
Customer.destroy = async function (id) {
  try {
    await deleteDoc( fsDoc( fsDb, "customers", id));
    console.log(`Customer record ${id} deleted.`);
  } catch( e) {
    console.error(`Error when deleting customer record: ${e}`);
  }
};
/**
 * Conversion between a Customer object and a corresponding Firestore document
 * @type {{toFirestore: (function(*): {id: string, name: string, phoneNumber: string}),
 * fromFirestore: (function(*, *=): Customer)}}
 */
Customer.converter = {
  toFirestore: function (customer) {
    return {
      id: customer.id,
      name: customer.name,
      phoneNumber: customer.phoneNumber
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data( options);
    return new Customer( data);
  }
};

/*******************************************
 *** Non specific use case procedures ******
 ********************************************/
/**
 * Handle DB-UI synchronization
 * @param isbn {string}
 * @returns {function}
 */
Customer.observeChanges = async function (customerId) {
  //try {
    // listen document changes, returning a snapshot (snapshot) on every change
    const customerDocRef = fsDoc( fsDb, "customers", customerId).withConverter( Customer.converter);
    const customerRec = (await getDoc( customerDocRef)).data();
    return onSnapshot( customerDocRef, function (snapshot) {
      // create object with original document data
      const originalData = { itemName: "customer", description: customerRec.name };
      if (!snapshot.data()) { // removed: if snapshot has not data
        originalData.type = "REMOVED";
        createModalFromChange( originalData); // invoke modal window reporting change of original data
      } else if (JSON.stringify( customerRec) !== JSON.stringify( snapshot.data())) {
        originalData.type = "MODIFIED";
        createModalFromChange( originalData); // invoke modal window reporting change of original data
      }
    });
  /*} catch (e) {
    console.error(`${e.constructor.name} : ${e.message}`);
  }*/
}

/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 * Create test data
 */
Customer.generateTestData = async function () {
  try {
    console.log("Generating test data...");
    const response = await fetch( "../../test-data/customers.json");
    const customerRecs = await response.json();
    console.log(customerRecs)
    await Promise.all( customerRecs.map( d => Customer.add( d)));
    console.log(`${customerRecs.length} customer records saved.`);
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
  }
};
/**
 * Clear database
 */
Customer.clearData = async function () {
  if (confirm("Do you really want to delete all customer records?")) {
    // retrieve all customer documents from Firestore
    const customerRecs = await Customer.retrieveAll();
    // delete all documents
    await Promise.all( customerRecs.map( d => Customer.destroy( d.id)));
    // ... and then report that they have been deleted
    console.log(`${Object.values( customerRecs).length} customer records deleted.`);
  }
};

export default Customer;
