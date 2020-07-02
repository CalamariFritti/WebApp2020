/* ###########################################################
Methodes for creating Events
#############################################################
 */

mmm.v.createEvent = {
    setupUserInterface: async function () {
        const formEl = document.querySelector("section#Event-C > form#createEvent");
        const saveButton = formEl.commit;
        console.log(saveButton);
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            this.handleSaveButtonClickEvent);

        const artistData = await Artist.retrieveAll();
        let instances = {};
        // for each Event, create a table row with a cell for each attribute
        for (let e of artistData) {

            instances[e.artistID] = e;
        }
        const selectLineUpWidget = formEl.querySelector(".MultiChoiceWidget");
        let artists = Artist.retrieveAll();
        console.log(artists);
        util.createMultipleChoiceWidget( selectLineUpWidget, {},
            instances, "artistID", "name", 1);
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
        selectMembersWidget = formEl.querySelector(".MultiChoiceWidget"),
        multiChoiceListEl = selectMembersWidget.firstElementChild;
        let artistIdRefsToAdd =[];
        for (let mcListItemEl of multiChoiceListEl.children) {
            if (mcListItemEl.classList.contains("added")) {
                artistIdRefsToAdd.push( mcListItemEl.getAttribute("data-value"));
            }
        }
        await Event.add(slots,artistIdRefsToAdd);
        selectMembersWidget.innerHTML = "";
        formEl.reset();
    }
};