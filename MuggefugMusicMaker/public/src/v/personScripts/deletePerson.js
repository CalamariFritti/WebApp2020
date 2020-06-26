/* ###########################################################
Methodes for deleting Person
#############################################################
 */



mmm.v.deletePerson = {
    setupUserInterface: async function () {
        const formEl = document.forms['Person'],
            deleteButton = formEl.commit,
            selectPersonEl = formEl.selectPerson;
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
    },
    // Event handler for deleting a Event
    handleDeleteButtonClickEvent: async function () {
        const selectPersonEl = document.forms['Person'].selectPerson;
        const personID = selectPersonEl.value;
        if (personID) {
            await Person.destroy( personID);
            // remove deleted Person from select options
            selectPersonEl.remove( selectPersonEl.selectedIndex);

        }
    }
}