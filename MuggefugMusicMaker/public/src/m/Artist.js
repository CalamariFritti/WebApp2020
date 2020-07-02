class Artist {
    constructor({artistId,name,contact}) {
        this.artistId = artistId;
        this.name = name;
        this.contact = contact;
        //TODO: implement member
    }

    /* ################################################
    Getter/ Setter
    ##################################################
     */

    get artistId() {
        return this._artistId;
    }

    get name() {
        return this._name;
    }

    get contact() {
        return this._contact;
    }

    set artistId(artistId) {
        this._artistId = artistId;
    }

    set name(n) {
        this._name = n;
    }

    set contact(contact) {
        this._contact = contact;
    }

}
/* ################################################
        Database Managment
##################################################
*/

// load all Artists from the firebase database
Artist.retrieveAll = async function(){
    try {
        let collectArtists = db.collection("Artist"),
            queryArtists = await  collectArtists.get(),
            documentArtists = queryArtists.docs,
            eventRecord = documentArtists.map(d => d.data());
        console.log("Artists "+eventRecord);
        return eventRecord;
    } catch (error){
        console.log("Error retriving all Artists: $(error) ");
    }

}


// load a specifc Artist from the firebase database
Artist.retrieve = async function(eventID){
    try {
        let collectArtists = db.collection("Artist"),
            specificArtist =collectArtists.doc(eventID),
            queryArtist = await specificArtist.get(),
            eventRecord = queryArtist.data();
        console.log("Artist with the id" + eventID + "successfuly retrieved");
        return eventRecord;

    } catch (error){
        console.log("Error retriving a Artist: " + error);
    }

}
// add an Artist to the database
Artist.add = async function(slots){
    await db.collection("Artist").doc(slots.artistID).set(slots);
    console.log("Successfuly added an Artist named " + slots.name);
}

// update an Artist in the database
Artist.update = async function(slots){
    if (Object.keys( slots).length > 0) {
        await db.collection("Artist").doc(slots.artistID).update(slots);
        console.log("Artist" + slots.artistID +  "modified.");
    }
}

//delete an Artist in the database
Artist.destroy = async function(eventID){
    await db.collection("Artist").doc(eventID).delete();
    console.log("Successfuly deleted an Artist with id " + eventID);
}


Artist.retrieveArtistByEventId = async function(eventID) {

    db.collection("Artist").where("eventId", "==", eventID)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}
// Create test data
Artist.generateTestData = function () {
    let artistRecords = {};
    artistRecords["1"] = {artistID: "1",
        name: "Bushido", contact: "Bushido.de"};
    artistRecords["2"] = {artistID: "2",
        name: "Imagine Dragon", contact: "thedragons@web.de"};
    artistRecords["3"] = {artistID: "3",
        name: "Tolle Affen", contact: "Am anderen Ende"};
    artistRecords["4"] = {artistID: "4",
        name: "Max Giesinger", contact: "management@max.com"};
    // Save all test Book records to Firestore DB
    for (let id of Object.keys( artistRecords)) {
        let artistRecord = artistRecords[id];
        db.collection("Artist").doc( id).set( artistRecord);
    }
    console.log(`${Object.keys( artistRecords).length} artists saved.`);
};
// Clear test data
Artist.clearData = function () {
    if (confirm("Do you really want to delete all artist records?")) {
        // Retrieve all artist docs from the Firestore collection "artists"
        db.collection("Artist").get().then( function (artistsFsQuerySnapshot) {
            // Delete artist docs iteratively
            artistsFsQuerySnapshot.forEach( function (artistDoc) {
                db.collection("Artist").doc( artistDoc.id).delete();
            });
        });
    }
};