/* ###########################################################
Methodes for creating Events
#############################################################
 */

mmm.v.createEvent = {
    setupUserInterface: function () {
        const formEl = document.querySelector("section#Event-C > form#createEvent");
        const saveButton = formEl.commit;
        console.log(saveButton);
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            this.handleSaveButtonClickEvent);

        document.getElementById("Event-M").style.display = "none";
        document.getElementById("Event-C").style.display = "block";
    },
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['createEvent'];
        console.log(formEl);
        console.log("Daten werden übergeben.");
        const slots = {
            eventID: formEl.eventID.value,
            name: formEl.name.value,
            eventDate: parseInt( formEl.eventDate.value)
        };
        //add the Event to the database
        await Event.add( slots);
        formEl.reset();
    }
};