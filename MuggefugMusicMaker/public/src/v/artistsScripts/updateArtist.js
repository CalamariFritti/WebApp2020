/* ###########################################################
Methodes for updating Artists
#############################################################
 */


mmm.v.updateArtist = {
    setupUserInterface: async function () {
        const formEl = document.forms['updateArtist'];
            updateButton = formEl.commit,
            selectArtistEl = formEl.selectArtist;
        // load all artists
        const artists = await Artist.retrieveAll();
        selectArtistEl.innerHTML = "<option>---</option>";
        for (let e of artists) {
            let optionEl = document.createElement("option");
            optionEl.text = e.name;
            optionEl.value = e.artistID;
            selectArtistEl.add( optionEl, null);
        }
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
            } else {
                formEl.reset();
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
            contact: formEl.contact.value
        };
        await Artist.update(slots);
        // update the selection list option element
        selectArtistEl.options[selectArtistEl.selectedIndex].text = slots.title;
        formEl.reset();
    }
};