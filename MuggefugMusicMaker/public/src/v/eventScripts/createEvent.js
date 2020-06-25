/* ###########################################################
Methodes for creating Events
#############################################################
 */

mmm.v.createEvent = {
    setupUserInterface: function () {
        const saveButton = document.forms['Event'].commit;

        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            mmm.v.createEvent.handleSaveButtonClickEvent);
    },
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['Event'];
        const slots = {
            eventID: formEl.eventID.value,
            name: formEl.name.value,
            eventDate: parseInt( formEl.eventDate.value)
        };
        //add the Event to the database
        await Event.add( slots);
        formEl.reset();
    }
}