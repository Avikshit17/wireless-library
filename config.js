import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyBahrFIspU5VDwdTCOdjZFUbSymXIssYEc",
    authDomain: "wireless-library-410bb.firebaseapp.com",
    databaseURL: "https://wireless-library-410bb.firebaseio.com",
    projectId: "wireless-library-410bb",
    storageBucket: "wireless-library-410bb.appspot.com",
    messagingSenderId: "521480715289",
    appId: "1:521480715289:web:3c5f842482fca6e57dfe88"
  };
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export default firebase.firestore();
