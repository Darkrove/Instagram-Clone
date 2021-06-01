import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCwHdfXzMUZOznz9hTH3wa1X9WcqqtDZSo",
    authDomain: "instagram-clone-cd8de.firebaseapp.com",
    databaseURL: "https://instagram-clone-cd8de-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-cd8de",
    storageBucket: "instagram-clone-cd8de.appspot.com",
    messagingSenderId: "464594186908",
    appId: "1:464594186908:web:df3e171e506c7600f1f359",
    measurementId: "G-VBVQC53XYC"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export {db, auth, storage};