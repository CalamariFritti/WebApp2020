'use strict';
// main namespace mmm = "Muggefug music maker"
const mmm = {m: {}, v: {}, c: {}};
// initialize Firestore database
const db = firebase.firestore();
//initialize Firebase Authentication interface
const auth = firebase.auth();

mmm.m.init = {
    generateTestData: function () {
        Artist.generateTestData();
        Event.generateTestData();
        Person.generateTestData();
    },
    clearData: function () {
        Artist.clearData();
        Event.clearData();
        Person.clearData();
    }
};