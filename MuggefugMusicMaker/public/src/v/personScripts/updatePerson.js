/* ###########################################################
Methodes for updating Persons
#############################################################
 */


mmm.v.updatePerson = {
    setupUserInterface: async function () {
        const formEl = document.forms['updatePerson'];
        updateButton = formEl.commit,
            selectPersonEl = formEl.selectPerson;
        selectPersonEl.innerHTML = "<option>---</option>";
        // load all Persons
        const persons = await Person.retrieveAll();
        for (let p of persons) {
            let optionEl = document.createElement("option");
            optionEl.text = p.name;
            optionEl.value = p.personID;
            selectPersonEl.add( optionEl, null);
        }

        formEl.name.addEventListener("input", function () {
            formEl.name.setCustomValidity(
                Person.checkName( formEl.name.value).message)});

        // when a person is selected, fill the form with its data
        selectPersonEl.addEventListener("change", async function () {
            const personID = selectPersonEl.value;
            console.log("Selected Person has ID : "+ personID);
            if (personID) {
                // retrieve up-to-date person
                const person = await Person.retrieve( personID);
                formEl.personID.value = person.personID;
                formEl.name.value = person.name;
            } else {
                formEl.reset();
            }
        });
        // set an event handler for the submit/save button
        updateButton.addEventListener("click",
            mmm.v.updatePerson.handleSaveButtonClickEvent);
        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
        });

        document.getElementById("Person-M").style.display = "none";
        document.getElementById("Person-U").style.display = "block";
    },
    // save data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['updatePerson'],
            selectPersonEl = formEl.selectPerson;
        const slots = {
            personID: formEl.personID.value,
            name: formEl.name.value
        };

        formEl.name.setCustomValidity(
            Person.checkName( formEl.name.value).message);



        await Person.update(slots);
        // update the selection list option element
        selectPersonEl.options[selectPersonEl.selectedIndex].text = slots.name;
        formEl.reset();
    }
};