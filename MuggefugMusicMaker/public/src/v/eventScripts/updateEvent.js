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
        selectEventEl.innerHTML = "<option>---</option>"
        for (let e of events) {
            let optionEl = document.createElement("option");
            optionEl.text = e.name;
            optionEl.value = e.eventID;
            selectEventEl.add( optionEl, null);
        }
        // when a event is selected, fill the form with its data
        selectEventEl.addEventListener("change", async function () {
            const eventID = selectEventEl.value;
            console.log("Selected Event has ID : "+ eventID);
            if (eventID) {
                // retrieve up-to-date event
                const event = await Event.retrieve( eventID);
                formEl.eventID.value = event.eventID;
                formEl.name.value = event.name;
                formEl.eventDate.value = event.eventDate;

                const artistData = await Artist.retrieveAll();
                let instances = {};
                // for each Event, create a table row with a cell for each attribute
                for (let e of artistData) {

                    instances[e.artistID] = e;
                }
                const selectLineUpWidget = formEl.querySelector(".MultiChoiceWidget");
                let artists = Artist.retrieveAll();
                console.log(artists);
                util.createMultipleChoiceWidget( selectLineUpWidget, event.lineUp,
                    instances, "artistID", "name", 1);

            } else {
                formEl.reset();
                selectArtistWidget.innerHTML = "";

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
            eventID: formEl.eventID.value,
            name: formEl.name.value,
            eventDate: parseInt( formEl.eventDate.value)
        };
        selectArtistWidget = formEl.querySelector(".MultiChoiceWidget"),
        multiChoiceListEl = selectArtistWidget.firstElementChild;
        let artistIdRefsToRemove=[],artistIdRefsToAdd =[];
        for (let mcListItemEl of multiChoiceListEl.children) {
            if (mcListItemEl.classList.contains("removed")) {
                artistIdRefsToRemove.push( mcListItemEl.getAttribute("data-value"));
            }
            if (mcListItemEl.classList.contains("added")) {
                artistIdRefsToAdd.push( mcListItemEl.getAttribute("data-value"));
            }
        }
        await Event.update(slots,artistIdRefsToAdd,artistIdRefsToRemove);
        // update the selection list option element
        selectEventEl.options[selectEventEl.selectedIndex].text = slots.name;
        selectArtistWidget.innerHTML = "";
        formEl.reset();
    }
};