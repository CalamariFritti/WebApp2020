/* ###########################################################
Methodes for listing Person
#############################################################
 */



mmm.v.retrieveAndListAllPerson = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#persons>tbody");
        // load a list of all person from Firestore
        const personData = await Person.retrieveAll();
        tableBodyEl.innerHTML = "";
        // for each Person, create a table row with a cell for each attribute
        for (let p of personData) {
            let row = tableBodyEl.insertRow();
            row.insertCell(-1).textContent = p.personID;
            row.insertCell(-1).textContent = p.name;
        }

        document.getElementById("Person-M").style.display = "none";
        document.getElementById("Person-R").style.display = "block";
    }
};