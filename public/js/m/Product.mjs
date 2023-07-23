/**
 * @fileOverview  The model class product with attribute definitions and storage management methods
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
 * Constructor function for the class Product
 * @constructor
 * @param {{id: string, name: string, description: string, price: number, availabilityStatus: number}} slots - Object creation slots.
 */
class Product {
  // record parameter with the ES6 syntax for function parameter destructuring
  constructor({id, name, description, price, availabilityStatus}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.availabilityStatus = availabilityStatus;
  }
}
/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
/**
 * Create a Firestore document in the Firestore collection "products"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Product.add = async function (slots) {
  const productsCollRef = fsColl( fsDb, "products"),
    productDocRef = fsDoc (productsCollRef, slots.id);
  try {
    await setDoc( productDocRef, slots);
    console.log(`Product record ${slots.id} created.`);
  } catch( e) {
    console.error(`Error when adding product record: ${e}`);
  }
};
/**
 * Load a product record from Firestore
 * @param id: {object}
 * @returns {Promise<*>} productRecord: {array}
 */
Product.retrieve = async function (id) {
  let productDocSn = null;
  try {
    const productDocRef = fsDoc( fsDb, "product", id);
    productDocSn = await getDoc( productDocRef);
  } catch( e) {
    console.error(`Error when retrieving product record: ${e}`);
    return null;
  }
  const productRec = productDocSn.data();
  return productRec;
};
/**
 * Load all product records from Firestore
 * @returns {Promise<*>} productRecords: {array}
 */
Product.retrieveAll = async function () {
  let productsQrySn = null;
  try {
    const productsCollRef = fsColl( fsDb, "products");
    productsQrySn = await getDocs( productsCollRef);
  } catch( e) {
    console.error(`Error when retrieving product records: ${e}`);
    return null;
  }
  const productDocs = productsQrySn.docs,
    productRecs = productDocs.map( d => d.data());
  console.log(`${productRecs.length} product records retrieved.`);
  return productRecs;
};
/**
 * Update a Firestore document in the Firestore collection "products"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Product.update = async function (slots) {
  const updSlots = {};
  // retrieve up-to-date product record
  const productRec = await Product.retrieve( slots.id);
  // update only those slots that have changed
  if (productRec.name !== slots.name) updSlots.name = slots.name;
  if (productRec.description !== slots.description) updSlots.description = slots.description;
  if (productRec.price !== slots.price) updSlots.price = slots.price;
  if (productRec.availabilityStatus !== slots.availabilityStatus) updSlots.availabilityStatus = slots.availabilityStatus;
  if (Object.keys( updSlots).length > 0) {
    try {
      const productDocRef = fsDoc( fsDb, "products", slots.id);
      await updateDoc( productDocRef, updSlots);
      console.log(`Product record ${slots.id} modified.`);
    } catch( e) {
      console.error(`Error when updating product record: ${e}`);
    }
  }
};
/**
 * Delete a Firestore document from the Firestore collection "product"
 * @param id: {string}
 * @returns {Promise<void>}
 */
Product.destroy = async function (id) {
  try {
    await deleteDoc( fsDoc( fsDb, "products", id));
    console.log(`Product record ${id} deleted.`);
  } catch( e) {
    console.error(`Error when deleting product record: ${e}`);
  }
};
/**
 * Conversion between a product object and a corresponding Firestore document
 * @type {{toFirestore: (function(*): {id: string, name: string, description: string, price: number, availabilityStatus: number}),
 * fromFirestore: (function(*, *=): Product)}}
 */
Product.converter = {
  toFirestore: function (product) {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      availabilityStatus: product.availabilityStatus
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data( options);
    return new Product( data);
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
Product.observeChanges = async function (productId) {
  //try {
    // listen document changes, returning a snapshot (snapshot) on every change
    const productDocRef = fsDoc( fsDb, "product", productId).withConverter( Product.converter);
    const productRec = (await getDoc( productDocRef)).data();
    return onSnapshot( productDocRef, function (snapshot) {
      // create object with original document data
      const originalData = { itemName: "product", description: productRec.name };
      if (!snapshot.data()) { // removed: if snapshot has not data
        originalData.type = "REMOVED";
        createModalFromChange( originalData); // invoke modal window reporting change of original data
      } else if (JSON.stringify( productRec) !== JSON.stringify( snapshot.data())) {
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
Product.generateTestData = async function () {
  try {
    console.log("Generating test data...");
    const response = await fetch( "../../test-data/products.json");
    const productRecs = await response.json();
    console.log(productRecs)
    await Promise.all( productRecs.map( d => Product.add( d)));
    console.log(`${productRecs.length} product records saved.`);
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
  }
};
/**
 * Clear database
 */
Product.clearData = async function () {
  if (confirm("Do you really want to delete all product records?")) {
    // retrieve all product documents from Firestore
    const productRecs = await Product.retrieveAll();
    // delete all documents
    await Promise.all( productRecs.map( d => Product.destroy( d.id)));
    // ... and then report that they have been deleted
    console.log(`${Object.values( productRecs).length} product records deleted.`);
  }
};

export default Product;
