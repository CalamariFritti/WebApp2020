/* ###########################################################
Methodes for creating Events
#############################################################
 */

mmm.v.createArtist = {
    setupUserInterface: async function () {
        const saveButton = document.forms['createArtist'].commit;
        const formEl = document.forms['createArtist'];
        let categorySelectEl = formEl.category;

        formEl.reset();
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
           this.handleSaveButtonClickEvent);

        formEl.artistID.addEventListener("input", function () {
            formEl.artistID.setCustomValidity(
                Artist.checkArtistIdAsId( formEl.artistID.value).message)});

        formEl.name.addEventListener("input", function () {
            formEl.name.setCustomValidity(
                Artist.checkName( formEl.name.value).message)});
        util.fillSelectWithOptions( categorySelectEl, Genre.labels);
        const personData = await Person.retrieveAll();
        let instances = {};
        // for each Event, create a table row with a cell for each attribute
        for (let e of personData) {

            instances[e.personID] = e;
        }
        const selectMembersWidget = formEl.querySelector(".MultiChoiceWidget");
        let artists = Artist.retrieveAll();
        console.log(artists);
        util.createMultipleChoiceWidget( selectMembersWidget, {},
            instances, "personID", "name", 1);

        document.getElementById("Artist-M").style.display = "none";
        document.getElementById("Artist-C").style.display = "block";
    },
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['createArtist'];
        const slots = {
            artistID: formEl.artistID.value,
            name: formEl.name.value,
            contact: formEl.contact.value,
            genre: parseInt(parseInt(formEl.category.value)+1)
        };
        formEl.artistID.setCustomValidity(
            Artist.checkArtistIdAsId( formEl.artistID.value).message);

        formEl.name.setCustomValidity(
            Artist.checkName( formEl.name.value).message);


        const selectMembersWidget = formEl.querySelector(".MultiChoiceWidget");
        const multiChoiceListEl = selectMembersWidget.firstElementChild;
        let personIdRefsToAdd =[];
        for (let mcListItemEl of multiChoiceListEl.children) {
            if (mcListItemEl.classList.contains("added")) {
                personIdRefsToAdd.push( mcListItemEl.getAttribute("data-value"));
            }
        }
        if (formEl.checkValidity()) {
            await Artist.add(slots,personIdRefsToAdd);
            formEl.reset();
            selectMembersWidget.innerHTML = "";

        }
        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
            formEl.reset();
            selectMembersWidget.innerHTML = "";
        });


        document.getElementById("Artist-M").style.display = "none";
        document.getElementById("Artist-C").style.display = "block";
    }
};