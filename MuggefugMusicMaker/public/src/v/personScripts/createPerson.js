/* ###########################################################
Methodes for creating Persons
#############################################################
 */

mmm.v.createPerson = {
    setupUserInterface: function () {
        const saveButton = document.forms['Person'].commit;

        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            mmm.v.createPerson.handleSaveButtonClickEvent);
    },
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['Person'];
        const slots = {
            personID: formEl.personID.value,
            name: formEl.name.value
        };
        //add the Person to the database
        await Person.add( slots);
        formEl.reset();
    }
}