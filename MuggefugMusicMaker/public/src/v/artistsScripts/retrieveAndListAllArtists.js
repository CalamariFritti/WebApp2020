/* ###########################################################
Methodes for listing Events
#############################################################
 */



mmm.v.retrieveAndListAllArtists = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#artists>tbody");
        // load a list of all artists from Firestore
        const artistData = await Artist.retrieveAll();
        tableBodyEl.innerHTML = "";
        // for each Event, create a table row with a cell for each attribute
        for (let e of artistData) {
            let row = tableBodyEl.insertRow();
            row.insertCell(-1).textContent = e.artistID;
            row.insertCell(-1).textContent = e.name;
            row.insertCell(-1).textContent = e.contact;
        }
        document.getElementById("Artist-M").style.display = "none";
        document.getElementById("Artist-R").style.display = "block";
    }
};