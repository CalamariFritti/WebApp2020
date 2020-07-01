mmm.v.artists = {
    /** Set up the person management UI */
    setupUserInterface: function () {
        window.addEventListener("beforeunload", mmm.v.artists.exit);
        mmm.v.artists.refreshUI();
    },
    /** Exit the Manage persons UI page */
    exit: function () {
    },
    /** Refresh the Manage Persons UI */
    refreshUI: function () {
        // show the manage book UI and hide the other UIs
        document.getElementById("Artist-M").style.display = "block";
        document.getElementById("Artist-R").style.display = "none";
        document.getElementById("Artist-C").style.display = "none";
        document.getElementById("Artist-U").style.display = "none";
        document.getElementById("Artist-D").style.display = "none";
    }
};