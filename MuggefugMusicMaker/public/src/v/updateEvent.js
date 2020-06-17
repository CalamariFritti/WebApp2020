/* ###########################################################
Methodes for updating Events
#############################################################
 */


mmm.v.updateEvent = {
    setupUserInterface: async function () {
        const formEl = document.forms['Event'],
            updateButton = formEl.commit,
            selectEventEl = formEl.selectEvent;
        // load all events
        const events = await Event.retrieveAll();
        for (let e of events) {
            let optionEl = document.createElement("option");
            optionEl.text = e.name;
            optionEl.value = e.eventID;
            selectEventEl.add( optionEl, null);
        }
        // when a event is selected, fill the form with its data
        selectEventEl.addEventListener("change", async function () {
            const eventID = selectEventEl.value;
            if (eventID) {
                // retrieve up-to-date book record
                const event = await Event.retrieve( eventID);
                formEl.eventID.value = event.eventID;
                formEl.name.value = event.name;
                formEl.eventDate.value = event.eventDate;
            } else {
                formEl.reset();
            }
        });
        // set an event handler for the submit/save button
        updateButton.addEventListener("click",
            mmm.v.updateEvent.handleSaveButtonClickEvent);
        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
        });
    },
    // save data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['Event'],
            selectEventEl = formEl.selectEvent;
        const slots = {
            eventID: formEl.eventID.value,
            name: formEl.name.value,
            eventDate: parseInt( formEl.eventDate.value)
        };
        await Event.update(slots);
        // update the selection list option element
        selectEventEl.options[selectEventEl.selectedIndex].text = slots.title;
        formEl.reset();
    }
};