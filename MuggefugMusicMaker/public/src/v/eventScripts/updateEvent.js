/* ###########################################################
Methodes for updating Events
#############################################################
 */


mmm.v.updateEvent = {
    setupUserInterface: async function () {
        const formEl = document.forms['updateEvent'];
            updateButton = formEl.commit,
            selectEventEl = formEl.selectEvent;
        // load all events
        const events = await Event.retrieveAll();
        for (let e of events) {
            let optionEl = document.createElement("option");
            optionEl.text = e.name;
            optionEl.value = e.artistID;
            selectEventEl.add( optionEl, null);
        }
        // when a event is selected, fill the form with its data
        selectEventEl.addEventListener("change", async function () {
            const eventID = selectEventEl.value;
            console.log("Selected Event has ID : "+ eventID);
            if (eventID) {
                // retrieve up-to-date event
                const event = await Event.retrieve( eventID);
                formEl.artistID.value = event.artistID;
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

        document.getElementById("Event-M").style.display = "none";
        document.getElementById("Event-U").style.display = "block";
    },
    // save data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['updateEvent'],
            selectEventEl = formEl.selectEvent;
        const slots = {
            artistID: formEl.artistID.value,
            name: formEl.name.value,
            eventDate: parseInt( formEl.eventDate.value)
        };
        await Event.update(slots);
        // update the selection list option element
        selectEventEl.options[selectEventEl.selectedIndex].text = slots.name;
        formEl.reset();
    }
};