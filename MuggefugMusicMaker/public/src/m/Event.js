class Event {
    constructor({eventID, name, eventDate, lineUp,artistsToAdd,artistsToRemove}) {
        this.eventID = eventID;
        this.name = name;
        this.eventDate = eventDate;
        this._lineUp = lineUp;
    }

    /* ################################################
    Getter/ Setter
    ##################################################
     */

    get eventID() {
        return this._eventID;
    }

    get name() {
        return this._name;
    }

    get eventDate() {
        return this._eventDate;
    }

    set eventID(id) {
        this._eventID = id;
    }

    set name(n) {
        this._name = n;
    }

    set eventDate(date) {
        this._eventDate = date;
    }

    get lineUp() {
        return this._lineUp;
    }

    set lineUp(value) {
        this._lineUp = value;
    }
}
    /* ################################################
            Database Managment
 ##################################################
  */


    // load all Events from the firebase database
    Event.retrieveAll = async function(){
        try {
        let collectEvents = db.collection("Event"),
            queryEvents = await  collectEvents.get(),
            documentEvents = queryEvents.docs,
            eventRecord = documentEvents.map(d => d.data());
        console.log(collectEvents);
        return eventRecord;
        } catch (error){
            console.log("Error retriving all Events: $(error) ");
        }

    }


    // load a specifc Event from the firebase database
    Event.retrieve = async function(eventID){
        try {
            let collectEvents = db.collection("Event"),
                specificEvent =collectEvents.doc(eventID),
                queryEvent = await specificEvent.get(),
                eventRecord = queryEvent.data();
            console.log("Event with the id" + eventID + "successfuly retrieved");
            console.log(eventRecord);
            let event = new Event(eventRecord);
            let connections =  await Event.retrieveEventArtistConnection(event);
            let artists = {};
            for(let c of connections) {

                artists[c.artistID] =  await Artist.retrieve(c.artistID);
            }
            event.lineUp = artists;
            return event;

        } catch (error){
            console.log("Error retriving a Event: " + error);
        }

    }
    // add an Event to the database
    Event.add = async function(slots, artistIdRefsToAdd){
        await db.collection("Event").doc(slots.eventID).set(slots);
        await Event.addArtistsToEvent(slots,artistIdRefsToAdd);
        console.log("Successfuly added an Event named " + slots.name);
    }

    // update an Event in the database
    Event.update = async function(slots,artistsToAdd,artistsToRemove){
        if (Object.keys( slots).length > 0) {
            await db.collection("Event").doc(slots.eventID).update(slots);
            console.log("Event" + slots.eventID +  "modified.");
        }

        await Event.removeArtistsFromEvent(slots,artistsToRemove);
        await Event.addArtistsToEvent(slots,artistsToAdd);
    }

    //delete an Event in the database
    Event.destroy = async function(eventID){
        await db.collection("Event").doc(eventID).delete();
        console.log("Successfuly deleted an Event with id " + eventID);
    }


    Event.removeArtistsFromEvent = async function(slots,artistsToRemove){

        for (let artistID of artistsToRemove) {
            let connections = await Event.retrieveEventArtistConnection(slots,artistID);
            for(let ea of connections) {
                if(ea.artistID === artistID) {
                    let conn_query = db.collection("EventAndArtist").where("connection_id",'==',ea.connection_id);
                    conn_query.get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            doc.ref.delete();
                            console.log("Successfuly deleted an Event/Artist connection with id " + ea.connection_id);
                        });
                    });
                }

            }

        }
    }

    Event.retrieveEventArtistConnection = async function (slots) {

      return  db.collection("EventAndArtist")
            .where("eventID", "==", slots.eventID)
            .get()
            .then(function(querySnapshot) {
                const temp = [];
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    temp.push(doc.data());
                    console.log(doc.id, " => ", doc.data());
                });
                return temp;
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }
    Event.addArtistsToEvent = async function (slots,artistsToAdd) {
        let vars = {};
        vars.eventID = slots.eventID;
        for (let artistID of artistsToAdd) {
            vars.artistID = artistID;
            vars.connection_id = slots.eventID + artistID;
            await db.collection("EventAndArtist").doc(vars.connection_id).set(vars);
            console.log("Successfuly added an Event/Artist with ids " + slots.eventID+" and "+artistID);
        }

    }



// Create test data
Event.generateTestData = function () {
    let eventRecords = {};
    eventRecords["1"] = {eventID: "1",
        name: "Bushido Konzert", eventDate: "12.07.2020"};
    eventRecords["2"] = {eventID: "2",
        name: "Die Party des Löwen", eventDate: "13.03.2021"};
    eventRecords["3"] = {eventID: "3",
        name: "Der Wahnsinn", eventDate: "15.09.2019"};
    eventRecords["4"] = {eventID: "4",
        name: "Die gute Ute", eventDate: "28.02.2019"};
    // Save all test Book records to Firestore DB
    for (let id of Object.keys( eventRecords)) {
        let eventRecord = eventRecords[id];
        db.collection("Event").doc( id).set( eventRecord);
    }
    console.log(`${Object.keys( eventRecords).length} events saved.`);
};
// Clear test data
Event.clearData = function () {
    if (confirm("Do you really want to delete all event records?")) {
        // Retrieve all event docs from the Firestore collection "events"
        db.collection("Event").get().then( function (eventsFsQuerySnapshot) {
            // Delete event docs iteratively
            eventsFsQuerySnapshot.forEach( function (eventDoc) {
                db.collection("Event").doc( eventDoc.id).delete();
            });
        });
    }
};