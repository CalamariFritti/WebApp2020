/* ###########################################################
Methodes for updating Artists
#############################################################
 */


mmm.v.updateArtist = {
    setupUserInterface: async function () {
        const formEl = document.forms['updateArtist'];
        const updateButton = formEl.commit;
        const selectArtistEl = formEl.selectArtist;
        let categorySelectEl = formEl.category;
        const selectMembersWidget = formEl.querySelector(".MultiChoiceWidget");
        selectMembersWidget.innerHTML = "";
        formEl.reset();
        // load all artists
        const artists = await Artist.retrieveAll();
        selectArtistEl.innerHTML = "<option>---</option>";
        for (let e of artists) {
            let optionEl = document.createElement("option");
            optionEl.text = e.name;
            optionEl.value = e.artistID;
            selectArtistEl.add( optionEl, null);
        }
        util.fillSelectWithOptions( categorySelectEl, Genre.labels);
        formEl.name.addEventListener("input", function () {
            formEl.name.setCustomValidity(
                Artist.checkName( formEl.name.value).message)});

        // when a artist is selected, fill the form with its data
        selectArtistEl.addEventListener("change", async function () {
            const artistID = selectArtistEl.value;
            console.log("Selected Artist has ID : "+ artistID);
            if (artistID) {
                // retrieve up-to-date artist
                const artist = await Artist.retrieve( artistID);
                formEl.artistID.value = artist.artistID;
                formEl.name.value = artist.name;
                formEl.contact.value = artist.contact;
                formEl.category.selectedIndex = parseInt(artist.genre);
                console.log("Genre ist: "+artist.genre);
                const personData = await Person.retrieveAll();
                let instances = {};
                // for each Event, create a table row with a cell for each attribute
                for (let e of personData) {

                    instances[e.personID] = e;
                }

                util.createMultipleChoiceWidget( selectMembersWidget, artist.members,
                    instances, "personID", "name", 1);

            } else {
                formEl.reset();
                selectMembersWidget.innerHTML = "";

            }
        });
        // set an artist handler for the submit/save button
        updateButton.addEventListener("click",
            mmm.v.updateArtist.handleSaveButtonClickEvent);
        // neutralize the submit artist
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
        });

        document.getElementById("Artist-M").style.display = "none";
        document.getElementById("Artist-U").style.display = "block";
    },
    // save data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['updateArtist'],
            selectArtistEl = formEl.selectArtist;
        const slots = {
            artistID: formEl.artistID.value,
            name: formEl.name.value,
            contact: formEl.contact.value,
            genre: parseInt(parseInt(formEl.category.value)+1)
        };
        formEl.name.setCustomValidity(
            Artist.checkName( formEl.name.value).message);

        const selectMembersWidget = formEl.querySelector(".MultiChoiceWidget");
        let multiChoiceListEl = selectMembersWidget.firstElementChild;
        let personIdRefsToRemove=[],personIdRefsToAdd =[];
        for (let mcListItemEl of multiChoiceListEl.children) {
            if (mcListItemEl.classList.contains("removed")) {
                personIdRefsToRemove.push( mcListItemEl.getAttribute("data-value"));
            }
            if (mcListItemEl.classList.contains("added")) {
                personIdRefsToAdd.push( mcListItemEl.getAttribute("data-value"));
            }
        }
        if (formEl.checkValidity()) {
            await Artist.update(slots,personIdRefsToAdd,personIdRefsToRemove);
            // update the selection list option element
            selectArtistEl.options[selectArtistEl.selectedIndex].text = slots.name;
            selectMembersWidget.innerHTML = "";

            formEl.reset();
        }

    }
};