/* ###########################################################
Methodes for creating Events
#############################################################
 */

mmm.v.createArtist = {
    setupUserInterface: function () {
        const saveButton = document.forms['createArtist'].commit;

        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
           this.handleSaveButtonClickEvent);
        document.getElementById("Artist-M").style.display = "none";
        document.getElementById("Artist-C").style.display = "block";
    },
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['createArtist'];
        const slots = {
            artistID: formEl.artistID.value,
            name: formEl.name.value,
            contact: formEl.contact.value
        };
        //add the Event to the database
        await Artist.add( slots);
        formEl.reset();
    }
};