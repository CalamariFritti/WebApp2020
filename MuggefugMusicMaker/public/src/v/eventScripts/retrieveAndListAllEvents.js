/* ###########################################################
Methodes for listing Events
#############################################################
 */



mmm.v.retrieveAndListAllEvents = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#events>tbody");
        tableBodyEl.innerHTML = "";  // drop old contents
        // load a list of all eventss from Firestore
        const eventData = await Event.retrieveAll();
        // for each Event, create a table row with a cell for each attribute
        for (let e of eventData) {
            let row = tableBodyEl.insertRow();
            let artist_connections = await Event.retrieveEventArtistConnection(e);
            let artists = {};
            for(let c of artist_connections) {
                let artist = await Artist.retrieve(c.artistID);
                artists[c.artistID] = artist;
            }
            const listEl = util.createListFromMap( artists, "name");
            row.insertCell(-1).textContent = e.eventID;
            row.insertCell(-1).textContent = e.name;
            row.insertCell(-1).textContent = e.eventDate;
            row.insertCell(-1).appendChild( listEl);
        }

        document.getElementById("Event-M").style.display = "none";
        document.getElementById("Event-R").style.display = "block";
    }
};