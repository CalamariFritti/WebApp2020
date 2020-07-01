mmm.v.events = {
    /** Set up the person management UI */
    setupUserInterface: function () {
        window.addEventListener("beforeunload", mmm.v.events.exit);
        mmm.v.events.refreshUI();
    },
    /** Exit the Manage persons UI page */
    exit: function () {
    },
    /** Refresh the Manage Persons UI */
    refreshUI: function () {
        // show the manage book UI and hide the other UIs
        document.getElementById("Event-M").style.display = "block";
        document.getElementById("Event-R").style.display = "none";
        document.getElementById("Event-C").style.display = "none";
        document.getElementById("Event-U").style.display = "none";
        document.getElementById("Event-D").style.display = "none";
    }
};