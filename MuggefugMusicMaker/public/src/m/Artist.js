
Genre = new Enumeration(["Rock","Hiphop","Rap"]);
class Artist {

    constructor({artistID,name,contact,members,genre}) {
        this.artistID = artistID;
        this.name = name;
        this.contact = contact;
        this._members = members;
        this.genre = genre;
    }

    /* ################################################
    Getter/ Setter
    ##################################################
     */

    get artistID() {
        return this._artistId;
    }

    get name() {
        return this._name;
    }

    get contact() {
        return this._contact;
    }


    get genre() {
        return this._genre;
    }

    set genre(value) {
        this._genre = value;
    }

    set artistID(artistId) {
        this._artistId = parseInt(artistId);
        let constraintViolation = Artist.checkArtistId(artistId);
        if (constraintViolation instanceof NoConstraintViolation) {
            this._artistId = parseInt(artistId);
        } else {
            throw constraintViolation;
        }
    }

    set name(name) {
        this._name = name;
        const validationResult = Artist.checkName(name);
        if (validationResult instanceof NoConstraintViolation) {
            this._name = name;
        } else {
            throw validationResult;
        }
    }

    set contact(contact) {
        this._contact = contact;
    }


    get members() {
        return this._members;
    }

    set members(value) {
        this._members = value;
    }

    /**
     * Checks if everything is correct with the name
     * @param name string
     * @returns ConstraintViolation
     */
    static checkName(name) {
        if (name === undefined || name === "" || name === "\"\"") {
            return new MandatoryValueConstraintViolation("A name must be provided!");
        } else if (name === "" || name === undefined) {
            return new RangeConstraintViolation("The name must be a non-empty string!");
        } else {
            return new NoConstraintViolation();
        }
    }
    /**
     * Checks if everything is correct with the id
     * @param id string|number
     * @returns ConstraintViolation
     */
    static checkArtistId(id) {
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
    /**
     * Checks if everything is correct with the id as id ref
     * @param id string|number
     * @returns ConstraintViolation
     */
    static checkArtistIdAsId (id) {

        let constraintViolation = Artist.checkArtistId(id);
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

};


// load a specifc Artist from the firebase database
Artist.retrieve = async function(artistID){
    try {
        let collectArtists = db.collection("Artist"),
            specificArtist =collectArtists.doc(artistID),
            queryArtist = await specificArtist.get(),
            eventRecord = queryArtist.data();
        console.log("Artist with the id " + eventRecord.artistID + " successfully retrieved");
        let artist = new Artist(eventRecord);
        let connections =  await Artist.retrieveArtistPersonConnection(eventRecord);
        let persons = {};
        console.log("ConnectionArtistPerson Array size: "+connections.length);
        for(let c of connections) {

          try{
              persons[c.personID] =  await Person.retrieve(c.personID);
          } catch (e) {
              console.log(e+" But the show must go on");
          }
        }
        artist.members = persons;
        console.log(persons);
        return artist;

    } catch (error){
        console.log("Error retriving a Artist: " + error);
    }

};
// add an Artist to the database
Artist.add = async function(slots,personIdRefsToAdd){
    await db.collection("Artist").doc(slots.artistID).set(slots);
    await Artist.addPersonsToArtist(slots,personIdRefsToAdd);
    console.log("Successfuly added an Artist named " + slots.name);
};

// update an Artist in the database
Artist.update = async function(slots,personsToAdd,personsToRemove){
    if (Object.keys( slots).length > 0) {
        await db.collection("Artist").doc(slots.artistID).update(slots);
        console.log("Artist " + slots.artistID +  " modified.");
    }
    await Artist.removePersonsFromArtist(slots,personsToRemove);
    await Artist.addPersonsToArtist(slots,personsToAdd);
};

//delete an Artist in the database
Artist.destroy = async function(artistID){
    await db.collection("Artist").doc(artistID).delete();
    console.log("Successfuly deleted an Artist with id " + artistID);
    let conn_query = await db.collection("ArtistAndPerson").where("artistID",'==',artistID);
    conn_query.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
            console.log("Successfuly deleted an Artist/Person connection with artistID " + artistID);
        });
    });
    let connevent_query = await db.collection("EventAndArtist").where("artistID",'==',artistID);
    connevent_query.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
            console.log("Successfuly deleted an Artist/Event connection with artistID " + artistID);
        });
    });
};

// retrieves all artists by a given by an eventId
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
};

// removes all given persons from an artist
Artist.removePersonsFromArtist = async function(slots,personsToRemove){

    for (let personID of personsToRemove) {
        let connections = await Artist.retrieveArtistPersonConnection(slots,personID);
        for(let ea of connections) {
            if(ea.personID === personID) {
                let conn_query = db.collection("ArtistAndPerson").where("connection_id",'==',ea.connection_id);
                conn_query.get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        doc.ref.delete();
                        console.log("Successfuly deleted an Artist/Person connection with id " + ea.connection_id);
                    });
                });
            }
        }
    }
};

// retrives all connections between an artist and the persons
Artist.retrieveArtistPersonConnection = async function (slots) {

    return  db.collection("ArtistAndPerson")
        .where("artistID", "==", slots.artistID)
        .get()
        .then(function(querySnapshot) {
            console.log("retrieveArtistPersonConnection.."+slots.artistID);
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
};

// connects a person to an artist in the database
Artist.addPersonsToArtist = async function (slots,personsToAdd) {
    let vars = {};
    vars.artistID = slots.artistID;
    for (let personID of personsToAdd) {
        vars.personID = personID;
        vars.connection_id = slots.artistID + personID;
        await db.collection("ArtistAndPerson").doc(vars.connection_id).set(vars);
        console.log("Successfuly added an Artist/Person with ids " + slots.artistID+" and "+personID);
    }

};

// Create test data
Artist.generateTestData = function () {
    let artistRecords = {};
    artistRecords["1"] = {artistID: "1",
        name: "Bushido", contact: "Bushido.de", genre: Genre.RAP};
    artistRecords["2"] = {artistID: "2",
        name: "Imagine Dragon", contact: "thedragons@web.de",  genre: Genre.HIPHOP};
    artistRecords["3"] = {artistID: "3",
        name: "Tolle Affen", contact: "Am anderen Ende",  genre: Genre.RAP};
    artistRecords["4"] = {artistID: "4",
        name: "Max Giesinger", contact: "management@max.com",  genre: Genre.ROCK};
    // Save all test Book records to Firestore DB
    for (let id of Object.keys( artistRecords)) {
        let artistRecord = artistRecords[id];
        db.collection("Artist").doc( id).set( artistRecord);
    }
    console.log(`${Object.keys( artistRecords).length} artists saved.`);

    let artist_person_records = {};
    artist_person_records["11"] = {artistID: "1", personID: "1", connection_id: "11"};
    artist_person_records["22"] = {artistID: "2", personID: "2", connection_id: "22"};
    artist_person_records["23"] = {artistID: "2", personID: "3", connection_id: "23"};

    for (let id of Object.keys( artist_person_records)) {
        let artistPersonRecord = artist_person_records[id];
        db.collection("ArtistAndPerson").doc( id).set( artistPersonRecord);
    }
    console.log(`${Object.keys( artist_person_records).length} artists/persons saved.`);
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
        db.collection("ArtistAndPerson").get().then( function (artistsFsQuerySnapshot) {
            // Delete artist docs iteratively
            artistsFsQuerySnapshot.forEach( function (artistDoc) {
                db.collection("ArtistAndPerson").doc( artistDoc.id).delete();
            });
        });
    }
};