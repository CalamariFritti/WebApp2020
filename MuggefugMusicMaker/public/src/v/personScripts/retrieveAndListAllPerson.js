/* ###########################################################
Methodes for listing Person
#############################################################
 */



mmm.v.retrieveAndListAllPerson = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#person>tbody");
        // load a list of all person from Firestore
        const personData = await Person.retrieveAll();
        // for each Person, create a table row with a cell for each attribute
        for (let p of personData) {
            let row = tableBodyEl.insertRow();
            row.insertCell(-1).textContent = p.personID;
            row.insertCell(-1).textContent = p.name;
        }
    }
}