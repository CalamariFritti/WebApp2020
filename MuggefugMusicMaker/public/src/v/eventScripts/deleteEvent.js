/* ###########################################################
Methodes for deleting Events
#############################################################
 */



mmm.v.deleteEvent = {
    setupUserInterface: async function () {
        const formEl = document.forms['Event'],
            deleteButton = formEl.commit,
            selectEventEl = formEl.selectEvent;
        // load all Events
        const events = await Event.retrieveAll();
        for (let e of events) {
            let optionEl = document.createElement("option");
            optionEl.text = e.name;
            optionEl.value = e.eventID;
            selectEventEl.add( optionEl, null);
        }
        // Set an event handler for the submit/delete button
        deleteButton.addEventListener("click",
            mmm.v.deleteEvent.handleDeleteButtonClickEvent);
    },
    // Event handler for deleting a Event
    handleDeleteButtonClickEvent: async function () {
        const selectEventEl = document.forms['Event'].selectEvent;
        const eventID = selectEventEl.value;
        if (eventID) {
            await Event.destroy( eventID);
            // remove deleted Event from select options
            selectEventEl.remove( selectEventEl.selectedIndex);

        }
    }
}