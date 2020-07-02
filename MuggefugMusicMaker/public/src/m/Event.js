class Event {
    constructor({eventID, name, eventDate, lineUp,artistsToAdd,artistsToRemove}) {
        this.eventID = eventID;
        this.name = name;
        this.eventDate = eventDate;
        this.lineUp = lineUp;
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
        let constraintViolation = Event.checkEventId(id);
        if (constraintViolation instanceof NoConstraintViolation) {
            this._eventID = id;
        } else {
            throw constraintViolation;
        }
    }

    set name(name) {
        this._name = name;
       const validationResult = Event.checkName(name);
        if (validationResult instanceof NoConstraintViolation) {
            this._name = name;
        } else {
            throw validationResult;
        }
    }

    set eventDate(date) {
        let validationResult = Event.checkDate( date);
        if (validationResult instanceof NoConstraintViolation) {
            this._eventDate = date;
        } else {
            throw validationResult;
        }
    }

    get lineUp() {
        return this._lineUp;
    }

    set lineUp(value) {
        this._lineUp = value;
    }

    static checkName(name) {
        if (name === undefined || name === "" || name === "\"\"") {
            return new MandatoryValueConstraintViolation("A name must be provided!");
        } else if (name === "" || name === undefined) {
            return new RangeConstraintViolation("The name must be a non-empty string!");
        } else {
            return new NoConstraintViolation();
        }
    }
    static checkEventId(id) {
        if (id === undefined) {
            return new NoConstraintViolation();  // may be optional as an IdRef
        } else {
            // convert to integer
            id = parseInt(id);
            if (isNaN(id) || !Number.isInteger(id) || id < 1) {
                return new RangeConstraintViolation("The person ID must be a positive integer!");
            } else {
                return new NoConstraintViolation();
            }
        }
    }
    static checkEventIdAsId (id) {

        let constraintViolation = Event.checkEventId(id);
        // let person = await Person.retrieve(id);
        if ((constraintViolation instanceof NoConstraintViolation)) {
            // convert to integer
            id = parseInt(id);
            if (isNaN(id)) {
                return new MandatoryValueConstraintViolation(
                    "A positive integer value for the person ID is required!");
            }  else {
                console.log("ID Person ist: "+id);
                constraintViolation = new NoConstraintViolation();
            }
        }
        return constraintViolation;
    }
    static checkDate (date) {
        if(undefined === date || date === "") {
            return new MandatoryValueConstraintViolation("There must be a Date");
        }
        let objectReleaseDate = new Date(date);
        let isoDate;
        try {
            isoDate = util.createIsoDateString(objectReleaseDate);
        } catch (e){
            return new RangeConstraintViolation("The release Date has not the correct iso format YYYY-MM-DD");
        }
        if(util_old.isNotIsoDateString(isoDate)) {
            return new RangeConstraintViolation("The release Date has not the correct iso format YYYY-MM-DD");
        }
        return new NoConstraintViolation();

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
                try{
                    artists[c.artistID] =  await Artist.retrieve(c.artistID);
                } catch (e) {
                    console.log(e+" But the show must go on");
                }

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

        let conn_query = await db.collection("EventAndArtist").where("eventID",'==',eventID);
        conn_query.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
                console.log("Successfuly deleted an Artist/Event connection with eventID " + eventID);
            });
        });
    };


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
        name: "Bushido Konzert", eventDate: "2020-12-07"};
    eventRecords["2"] = {eventID: "2",
        name: "Die Party des Löwen", eventDate: "2021-11-03"};
    eventRecords["3"] = {eventID: "3",
        name: "Der Wahnsinn", eventDate: "2019-08-09"};
    eventRecords["4"] = {eventID: "4",
        name: "Die gute Ute", eventDate: "2019-02-28"};
    // Save all test Book records to Firestore DB
    for (let id of Object.keys( eventRecords)) {
        let eventRecord = eventRecords[id];
        db.collection("Event").doc( id).set( eventRecord);
    }
    console.log(`${Object.keys( eventRecords).length} events saved.`);

    let event_artist_record = {};
    event_artist_record["11"] = {eventID: "1", artistID: "1", connection_id: "11"};
    event_artist_record["22"] = {eventID: "2", artistID: "2", connection_id: "22"};
    event_artist_record["23"] = {eventID: "2", artistID: "3", connection_id: "23"};

    for (let id of Object.keys( event_artist_record)) {
        let eventArtistRecord = event_artist_record[id];
        db.collection("EventAndArtist").doc( id).set( eventArtistRecord);
    }
    console.log(`${Object.keys( event_artist_record).length} artists/persons saved.`);
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
        db.collection("EventAndArtist").get().then( function (eventsFsQuerySnapshot) {
            // Delete event docs iteratively
            eventsFsQuerySnapshot.forEach( function (eventDoc) {
                db.collection("EventAndArtist").doc( eventDoc.id).delete();
            });
        });
    }
};
