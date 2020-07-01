class Event {
    constructor({eventID, name, eventDate}) {
        this.eventID = eventID;
        this.name = name;
        this.eventDate = eventDate;
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
            return eventRecord;

        } catch (error){
            console.log("Error retriving a Event: " + error);
        }

    }
    // add an Event to the database
    Event.add = async function(slots){
        await db.collection("Event").doc(slots.artistID).set(slots);
        console.log("Successfuly added an Event named " + slots.name);
    }

    // update an Event in the database
    Event.update = async function(slots){
        if (Object.keys( slots).length > 0) {
            await db.collection("Event").doc(slots.artistID).update(slots);
            console.log("Event" + slots.artistID +  "modified.");
        }
    }

    //delete an Event in the database
    Event.destroy = async function(eventID){
        await db.collection("Event").doc(eventID).delete();
        console.log("Successfuly deleted an Event with id " + eventID);
    }


