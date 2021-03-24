import {firebase} from '@firebase/app';
import '@firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyB4Ez5vmKlqUZq5GYqwC0EHODlnQZoUGBg",
    authDomain: "book-santa-aa06a.firebaseapp.com",
    projectId: "book-santa-aa06a",
    storageBucket: "book-santa-aa06a.appspot.com",
    messagingSenderId: "362608577962",
    appId: "1:362608577962:web:7cb0139fbde67c8717efd3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();