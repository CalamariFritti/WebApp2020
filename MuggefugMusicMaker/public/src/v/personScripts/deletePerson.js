/* ###########################################################
Methodes for deleting Person
#############################################################
 */



mmm.v.deletePerson = {
    setupUserInterface: async function () {
        const formEl = document.forms['deletePerson'],
            deleteButton = formEl.commit,
            selectPersonEl = formEl.selectPerson;
        selectPersonEl.innerHTML = "<option>---</option>";

        // load all Person
        const persons = await Person.retrieveAll();
        for (let p of persons) {
            let optionEl = document.createElement("option");
            optionEl.text = p.name;
            optionEl.value = p.personID;
            selectPersonEl.add( optionEl, null);
        }
        // Set an event handler for the submit/delete button
        deleteButton.addEventListener("click",
            mmm.v.deletePerson.handleDeleteButtonClickEvent);

        document.getElementById("Person-M").style.display = "none";
        document.getElementById("Person-D").style.display = "block";
    },
    // Event handler for deleting a Event
    handleDeleteButtonClickEvent: async function () {
        const selectPersonEl = document.forms['deletePerson'].selectPerson;
        const personID = selectPersonEl.value;
        if (personID) {
            await Person.delete( personID);
            // remove deleted Person from select options
            selectPersonEl.remove( selectPersonEl.selectedIndex);

        }
    }
};