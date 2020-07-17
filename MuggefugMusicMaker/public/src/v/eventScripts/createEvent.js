/* ###########################################################
Methodes for creating Events
#############################################################
 */

mmm.v.createEvent = {
    setupUserInterface: async function () {
        const formEl = document.querySelector("section#Event-C > form#createEvent");
        const saveButton = formEl.commit;
        formEl.reset();
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            this.handleSaveButtonClickEvent);


        formEl.eventID.addEventListener("input", function () {
            formEl.eventID.setCustomValidity(
                Event.checkEventIdAsId( formEl.eventID.value).message)});

        formEl.name.addEventListener("input", function () {
            formEl.name.setCustomValidity(
                Event.checkName( formEl.name.value).message)});

        formEl.eventDate.addEventListener("input", function () {
            formEl.eventDate.setCustomValidity(
                Event.checkDate( formEl.eventDate.value).message)});

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
        const slots = {
            eventID: formEl.eventID.value,
            name: formEl.name.value,
            eventDate: formEl.eventDate.value
        };

            formEl.eventID.setCustomValidity(
                Event.checkEventIdAsId( formEl.eventID.value).message);

            formEl.name.setCustomValidity(
                Event.checkName( formEl.name.value).message);

            formEl.eventDate.setCustomValidity(
                Event.checkDate( formEl.eventDate.value).message);

        const selectMembersWidget = formEl.querySelector(".MultiChoiceWidget");
        const multiChoiceListEl = selectMembersWidget.firstElementChild;

        let artistIdRefsToAdd =[];
        for (let mcListItemEl of multiChoiceListEl.children) {
            if (mcListItemEl.classList.contains("added")) {
                artistIdRefsToAdd.push( mcListItemEl.getAttribute("data-value"));
            }
        }
        if (formEl.checkValidity()) await  await Event.add(slots,artistIdRefsToAdd);
        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
            formEl.reset();
            selectMembersWidget.innerHTML = "";
        });

        formEl.reset();
        selectMembersWidget.innerHTML = "";
        document.getElementById("Event-M").style.display = "none";
        document.getElementById("Event-C").style.display = "block";

    }
};