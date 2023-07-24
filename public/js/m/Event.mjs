/**
 * @fileOverview  The model class Event with attribute definitions and storage management methods
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
 * Constructor function for the class Event
 * @constructor
 * @param {{id: string, title: string, description: number}} slots - Object creation slots.
 */
class Event {
    // record parameter with the ES6 syntax for function parameter destructuring
    constructor({id, title, description, date, registeredCustomers}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.date = date;
        this.registeredCustomers = registeredCustomers;
    }
}
/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
/**
 * Create a Firestore document in the Firestore collection "events"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Event.add = async function (slots) {
    const eventsCollRef = fsColl( fsDb, "events"),
        eventDocRef = fsDoc (eventsCollRef, slots.id);
    try {
        await setDoc( eventDocRef, slots);
        console.log(`Event record ${slots.id} created.`);
    } catch( e) {
        console.error(`Error when adding event record: ${e}`);
    }
};
/**
 * Load a event record from Firestore
 * @param id: {object}
 * @returns {Promise<*>} eventRecord: {array}
 */
Event.retrieve = async function (id) {
    let eventDocSn = null;
    try {
        const eventDocRef = fsDoc( fsDb, "events", id);
        eventDocSn = await getDoc( eventDocRef);
    } catch( e) {
        console.error(`Error when retrieving event record: ${e}`);
        return null;
    }
    const eventRec = eventDocSn.data();
    return eventRec;
};
/**
 * Load all event records from Firestore
 * @returns {Promise<*>} eventRecords: {array}
 */
Event.retrieveAll = async function () {
    let eventsQrySn = null;
    try {
        const eventsCollRef = fsColl( fsDb, "events");
        eventsQrySn = await getDocs( eventsCollRef);
    } catch( e) {
        console.error(`Error when retrieving event records: ${e}`);
        return null;
    }
    const eventDocs = eventsQrySn.docs,
        eventRecs = eventDocs.map( d => d.data());
    console.log(`${eventRecs.length} event records retrieved.`);
    return eventRecs;
};
/**
 * Update a Firestore document in the Firestore collection "events"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Event.update = async function (slots) {
    const updSlots = {};
    // retrieve up-to-date event record
    const eventRec = await Event.retrieve( slots.id);
    // update only those slots that have changed
    if (eventRec.title !== slots.title) updSlots.title = slots.title;
    if (eventRec.description !== slots.description) updSlots.description = slots.description;
    if (eventRec.date !== slots.date) updSlots.date = slots.date;
    if (Object.keys( updSlots).length > 0) {
        try {
            const eventDocRef = fsDoc( fsDb, "events", slots.id);
            await updateDoc( eventDocRef, updSlots);
            console.log(`Event record ${slots.id} modified.`);
        } catch( e) {
            console.error(`Error when updating event record: ${e}`);
        }
    }
};
/**
 * Delete a Firestore document from the Firestore collection "events"
 * @param id: {string}
 * @returns {Promise<void>}
 */
Event.destroy = async function (id) {
    try {
        await deleteDoc( fsDoc( fsDb, "events", id));
        console.log(`Event record ${id} deleted.`);
    } catch( e) {
        console.error(`Error when deleting event record: ${e}`);
    }
};
/**
 * Conversion between a Event object and a corresponding Firestore document
 * @type {{toFirestore: (function(*): {id: string, title: string, description: string}),
 * fromFirestore: (function(*, *=): Event)}}
 */
Event.converter = {
    toFirestore: function (event) {
        return {
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date

        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data( options);
        return new Event( data);
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
Event.observeChanges = async function (eventId) {
    //try {
    // listen document changes, returning a snapshot (snapshot) on every change
    const eventDocRef = fsDoc( fsDb, "events", eventId).withConverter( Event.converter);
    const eventRec = (await getDoc( eventDocRef)).data();
    return onSnapshot( eventDocRef, function (snapshot) {
        // create object with original document data
        const originalData = { itemTitle: "event", description: eventRec.title };
        if (!snapshot.data()) { // removed: if snapshot has not data
            originalData.type = "REMOVED";
            createModalFromChange( originalData); // invoke modal window reporting change of original data
        } else if (JSON.stringify( eventRec) !== JSON.stringify( snapshot.data())) {
            originalData.type = "MODIFIED";
            createModalFromChange( originalData); // invoke modal window reporting change of original data
        }
    });
    /*} catch (e) {
      console.error(`${e.constructor.title} : ${e.message}`);
    }*/
}

/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 * Create test data
 */
Event.generateTestData = async function () {
    try {
        console.log("Generating test data...");
        const response = await fetch( "../../test-data/events.json");
        const eventRecs = await response.json();
        await Promise.all( eventRecs.map( d => Event.add( d)));
        console.log(`${eventRecs.length} event records saved.`);
    } catch (e) {
        console.error(`${e.constructor.title}: ${e.message}`);
    }
};
/**
 * Clear database
 */
Event.clearData = async function () {
    if (confirm("Do you really want to delete all event records?")) {
        // retrieve all event documents from Firestore
        const eventRecs = await Event.retrieveAll();
        // delete all documents
        await Promise.all( eventRecs.map( d => Event.destroy( d.id)));
        // ... and then report that they have been deleted
        console.log(`${Object.values( eventRecs).length} event records deleted.`);
    }
};

export default Event;
