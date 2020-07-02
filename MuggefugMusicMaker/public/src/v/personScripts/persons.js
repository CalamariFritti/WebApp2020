mmm.v.persons = {
    /** Set up the person management UI */
    setupUserInterface: function () {
        window.addEventListener("beforeunload", mmm.v.persons.exit);
        mmm.v.persons.refreshUI();
    },
    /** Exit the Manage persons UI page */
    exit: function () {
    },
    /** Refresh the Manage Persons UI */
    refreshUI: function () {
        // show the manage book UI and hide the other UIs
        document.getElementById("Person-M").style.display = "block";
        document.getElementById("Person-R").style.display = "none";
        document.getElementById("Person-C").style.display = "none";
        document.getElementById("Person-U").style.display = "none";
        document.getElementById("Person-D").style.display = "none";
    }
};