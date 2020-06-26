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
};



