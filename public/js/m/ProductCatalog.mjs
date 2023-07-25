/**
 * @fileOverview  The model class product catalog with attribute definitions and storage management methods
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
import Product from "./Product.mjs";

/**
 * Constructor function for the class ProductCatalog
 * @constructor
 * @param {{name: string}} slots - Object creation slots.
 */
class ProductCatalog {
  // record parameter with the ES6 syntax for function parameter destructuring
  constructor({name, contains}) {
    this.name = name;
    this.contains = contains;
  }

  static checkName( name) {
    if (typeof name === "string" && name.length > 0) return "";
    return "Must be longer than 0"
  }
  static async checkNameAsId( name) {
    if (ProductCatalog.checkName( name)) return ProductCatalog.checkName( name);
    if (!await ProductCatalog.retrieve( name)) return "";
    return "Already exists";
  }
  static async checkContains( contains) {
    const products = await Promise.all( contains.map((id) => Product.retrieve( id)));
    if ( products.every((p) => !!p)) return "";
    return "Not all IDs exist";
  }
}
/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
/**
 * Create a Firestore document in the Firestore collection "productCatalogs"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
ProductCatalog.add = async function (slots) {
  const productCatalogsCollRef = fsColl( fsDb, "productCatalogs"),
    productCatalogDocRef = fsDoc (productCatalogsCollRef, slots.name);
  try {
    await setDoc( productCatalogDocRef, slots);
    console.log(`Product catalog record ${slots.name} created.`);
  } catch( e) {
    console.error(`Error when adding product catalog record: ${e}`);
  }
};
/**
 * Load a product catalog record from Firestore
 * @param name: {object}
 * @returns {Promise<*>} productCatalogRecord: {array}
 */
ProductCatalog.retrieve = async function (name) {
  let productCatalogDocSn = null;
  try {
    const productCatalogDocRef = fsDoc( fsDb, "productCatalogs", name);
    productCatalogDocSn = await getDoc( productCatalogDocRef);
  } catch( e) {
    console.error(`Error when retrieving product catalog record: ${e}`);
    return null;
  }
  const productCatalogRec = productCatalogDocSn.data();
  return productCatalogRec;
};
/**
 * Load all product catalog records from Firestore
 * @returns {Promise<*>} productCatalogRecords: {array}
 */
ProductCatalog.retrieveAll = async function () {
  let productCatalogsQrySn = null;
  try {
    const productCatalogsCollRef = fsColl( fsDb, "productCatalogs");
    productCatalogsQrySn = await getDocs( productCatalogsCollRef);
  } catch( e) {
    console.error(`Error when retrieving product catalog records: ${e}`);
    return null;
  }
  const productCatalogDocs = productCatalogsQrySn.docs,
    productCatalogRecs = productCatalogDocs.map( d => d.data());
  console.log(`${productCatalogRecs.length} product catalog records retrieved.`);
  return productCatalogRecs;
};
/**
 * Update a Firestore document in the Firestore collection "productCatalogs"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
ProductCatalog.update = async function (slots) {
  const updSlots = {};
  // retrieve up-to-date product catalog record
  const productCatalogRec = await ProductCatalog.retrieve( slots.name);
  // update only those slots that have changed
  if (productCatalogRec.name !== slots.name) updSlots.name = slots.name;
  if (productCatalogRec.contains !== slots.contains) updSlots.contains = slots.contains;
  if (Object.keys( updSlots).length > 0) {
    try {
      const productCatalogDocRef = fsDoc( fsDb, "productCatalogs", slots.name);
      await updateDoc( productCatalogDocRef, updSlots);
      console.log(`Product catalog record ${slots.name} modified.`);
    } catch( e) {
      console.error(`Error when updating product catalog record: ${e}`);
    }
  }
};
/**
 * Delete a Firestore document from the Firestore collection "productCatalogs"
 * @param name: {string}
 * @returns {Promise<void>}
 */
ProductCatalog.destroy = async function (name) {
  try {
    await deleteDoc( fsDoc( fsDb, "productCatalogs", name));
    console.log(`Product catalog record ${name} deleted.`);
  } catch( e) {
    console.error(`Error when deleting product catalog record: ${e}`);
  }
};
/**
 * Conversion between a product catalog object and a corresponding Firestore document
 * @type {{toFirestore: (function(*): {name: string}),
 * fromFirestore: (function(*, *=): ProductCatalog)}}
 */
ProductCatalog.converter = {
  toFirestore: function (productCatalog) {
    return {
      name: productCatalog.name,
      contains: productCatalog.contains
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data( options);
    return new ProductCatalog( data);
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
ProductCatalog.observeChanges = async function (productCatalogName) {
  //try {
    // listen document changes, returning a snapshot (snapshot) on every change
    const productCatalogDocRef = fsDoc( fsDb, "productCatalogs", productCatalogName).withConverter( ProductCatalog.converter);
    const productCatalogRec = (await getDoc( productCatalogDocRef)).data();
    return onSnapshot( productCatalogDocRef, function (snapshot) {
      // create object with original document data
      const originalData = { itemName: "productCatalogs", description: productCatalogRec.name };
      if (!snapshot.data()) { // removed: if snapshot has not data
        originalData.type = "REMOVED";
        createModalFromChange( originalData); // invoke modal window reporting change of original data
      } else if (JSON.stringify( productCatalogRec) !== JSON.stringify( snapshot.data())) {
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
ProductCatalog.generateTestData = async function () {
  try {
    console.log("Generating test data...");
    const response = await fetch( "../../test-data/productCatalogs.json");
    const productCatalogRecs = await response.json();
    await Promise.all( productCatalogRecs.map( d => ProductCatalog.add( d)));
    console.log(`${productCatalogRecs.length} product catalog records saved.`);
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
  }
};
/**
 * Clear database
 */
ProductCatalog.clearData = async function () {
  if (confirm("Do you really want to delete all product catalog records?")) {
    // retrieve all product catalog documents from Firestore
    const productCatalogRecs = await ProductCatalog.retrieveAll();
    // delete all documents
    await Promise.all( productCatalogRecs.map( d => ProductCatalog.destroy( d.name)));
    // ... and then report that they have been deleted
    console.log(`${Object.values( productCatalogRecs).length} product catalog records deleted.`);
  }
};

export default ProductCatalog;
