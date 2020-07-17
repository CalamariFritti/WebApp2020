/* ###########################################################
Methodes for creating Persons
#############################################################
 */

mmm.v.createPerson = {
    setupUserInterface:  function () {
        const saveButton = document.forms['createPerson'].commit;
        const formEl = document.forms['createPerson'];

        formEl.reset();
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            mmm.v.createPerson.handleSaveButtonClickEvent);

        formEl.personID.addEventListener("input", function () {
            formEl.personID.setCustomValidity(
                Person.checkPersonIdAsId( formEl.personID.value).message)});

        formEl.name.addEventListener("input", function () {
            formEl.name.setCustomValidity(
                Person.checkName( formEl.name.value).message)});

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
            formEl.personID.setCustomValidity(
                Person.checkPersonIdAsId( formEl.personID.value).message);

            formEl.name.setCustomValidity(
                Person.checkName( formEl.name.value).message);


        //add the Person to the database
        if (formEl.checkValidity()) {
            await Person.add( slots);
            formEl.reset();
        }
        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
            formEl.reset();
        });
        document.getElementById("Person-M").style.display = "none";
        document.getElementById("Person-C").style.display = "block";

    }
};