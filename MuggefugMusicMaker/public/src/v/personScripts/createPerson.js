/* ###########################################################
Methodes for creating Persons
#############################################################
 */

mmm.v.createPerson = {
    setupUserInterface: function () {
        const saveButton = document.forms['createPerson'].commit;

        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            mmm.v.createPerson.handleSaveButtonClickEvent);

        document.getElementById("Person-M").style.display = "none";
        document.getElementById("Person-C").style.display = "block";
    },
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['createPerson'];
        const slots = {
            personID: formEl.personID.value,
            name: formEl.name.value
        };
        //add the Person to the database
        await Person.add( slots);
        formEl.reset();
    }
}