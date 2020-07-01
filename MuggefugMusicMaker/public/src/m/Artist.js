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
        console.log(collectArtists);
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


