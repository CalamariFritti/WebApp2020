class Artist {
    constructor({artistId: artistId, name: name, contact: contact}) {
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
        return (await db.collection("artists").get()).docs.map(d => d.data);
    } catch (error){
        console.log("Error retriving all Artists: $(error) ");
    }

};


// load a specifc Event from the firebase database
Artist.retrieve = async function(artistId){
    try {
        return (await db.collection("artists").doc(artistId).get()).data();
    } catch (error){
        console.log("Error retriving a Artist: " + error);
    }

};
// add an artist to the database
Artist.add = async function(slots){
    await db.collection("artists").doc(slots.artistId).set(slots);
    console.log("Successfuly added an artist named " + slots.name);
};

// update an artist in the database
Artist.update = async function(slots){
    if (Object.keys( slots).length > 0) {
        await db.collection("artists").doc(slots.artistId).update(slots);
        console.log("Artist" + slots.artistId +  "modified.");
    }
};

//delete an artist in the database
Artist.delete = async function(artistId){
    await db.collection("artists").doc(artistId).delete();
    console.log("Successfuly deleted an Artist with id " + artistId);
};


