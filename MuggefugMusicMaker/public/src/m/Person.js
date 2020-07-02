class Person {
constructor({personID, name}) {
    this.personID = personID;
    this.name = name;
    //Maybe add an Enum for the role in the band eg. Singer or Drummer
    }
    /*######################################################
    Getter/Setter
    ####################################################### */

    get personID(){
        return this._personID;
    }

    get name(){
        return this._name;
    }

    set personID(personID){
        this._personID = personID;
    }

    set name(n){
        this._name = n;
    }
}

/* ################################################
        Database Managment
##################################################
*/

// load all Person from the firebase database
Person.retrieveAll = async function(){
    try {
        let collectPerson = db.collection("Person"),
            queryPerson = await  collectPerson.get(),
            documentPerson = queryPerson.docs,
            personRecord = documentPerson.map(d => d.data());
        console.log(collectPerson);
        return personRecord;
    } catch (error){
        console.log("Error retrieving all Person: $(error) ");
    }

};


// load a specifc Person from the firebase database
Person.retrieve = async function(personID){
    try {
        return (await db.collection("Person").doc(personID).get()).data();
    } catch (error){
        console.log("Error retrieving a Person: " + error);
    }

};
// add a person to the database
Person.add = async function(slots){
    await db.collection("Person").doc(slots.personID).set(slots);
    console.log("Successfuly added an Person named " + slots.name);
};

// update a person in the database
Person.update = async function(slots){
    if (Object.keys( slots).length > 0) {
        await db.collection("Person").doc(slots.personID).update(slots);
        console.log("Person" + slots.personID +  "modified.");
    }
};

//delete a person in the database
Person.delete = async function(personID){
    await db.collection("Person").doc(personID).delete();
    console.log("Successfuly deleted a Person with id " + personID);

    let conn_query = await db.collection("ArtistAndPerson").where("personID",'==',personID);
    conn_query.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
            console.log("Successfuly deleted an Artist/Person connection with personID " + personID);
        });
    });
};



// Create test data
Person.generateTestData = function () {
    let personRecords = {};
    personRecords["1"] = {personID: "1",
        name: "Anis Mohamed Youssef Ferchichi"};
    personRecords["2"] = {personID: "2",
        name: "Udo Lindenberg"};
    personRecords["3"] = {personID: "3",
        name: "Klara Himmel"};
    personRecords["4"] = {personID: "4",
        name: "Peter Maffay"};
    // Save all test Book records to Firestore DB
    for (let id of Object.keys( personRecords)) {
        let personRecord = personRecords[id];
        db.collection("Person").doc( id).set( personRecord);
    }
    console.log(`${Object.keys( personRecords).length} persons saved.`);
};
// Clear test data
Person.clearData = function () {
    if (confirm("Do you really want to delete all person records?")) {
        // Retrieve all person docs from the Firestore collection "persons"
        db.collection("Person").get().then( function (personsFsQuerySnapshot) {
            // Delete person docs iteratively
            personsFsQuerySnapshot.forEach( function (personDoc) {
                db.collection("Person").doc( personDoc.id).delete();
            });
        });
    }
};