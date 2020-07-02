/* ###########################################################
Methodes for deleting Artists
#############################################################
 */



mmm.v.deleteArtist = {
    setupUserInterface: async function () {
        const formEl = document.forms['deleteArtist'],
            deleteButton = formEl.commit,
            selectArtistEl = formEl.selectArtist;
        // load all Artists
        const artists = await Artist.retrieveAll();
        selectArtistEl.innerHTML = "<option>---</option>";
        for (let e of artists) {
            let optionEl = document.createElement("option");
            optionEl.text = e.name;
            optionEl.value = e.artistID;
            selectArtistEl.add( optionEl, null);
        }
        // Set an artist handler for the submit/delete button
        deleteButton.addEventListener("click",
            mmm.v.deleteArtist.handleDeleteButtonClickEvent);

        document.getElementById("Artist-M").style.display = "none";
        document.getElementById("Artist-D").style.display = "block";

    },
    // Artist handler for deleting a Artist
    handleDeleteButtonClickEvent: async function () {
        const selectArtistEl = document.forms['deleteArtist'].selectArtist;
        const artistID = selectArtistEl.value;
        if (artistID) {
            await Artist.destroy( artistID);
            // remove deleted Artist from select options
            selectArtistEl.remove( selectArtistEl.selectedIndex);

        }
    }
}