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
            let person_connections = await Artist.retrieveArtistPersonConnection(e);
            let persons = {};
            for(let c of person_connections) {
                persons[c.personID] = await Person.retrieve(c.personID);
            }
            const listEl = util.createListFromMap( persons, "name");
            let genre = "";
            switch (e.genre) {
                case Genre.RAP:
                    genre = "Rap";
                    break;
                case Genre.HIPHOP:
                    genre="Hiphop";
                    break;
                case Genre.ROCK:
                    genre = "Rock";
                    break;
            }
            row.insertCell(-1).textContent = e.artistID;
            row.insertCell(-1).textContent = e.name;
            row.insertCell(-1).textContent = e.contact;
            row.insertCell(-1).appendChild( listEl);
            row.insertCell(-1).textContent = genre;
        }
        document.getElementById("Artist-M").style.display = "none";
        document.getElementById("Artist-R").style.display = "block";
    }
};