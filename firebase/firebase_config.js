const firebase = require('firebase');
  var config = {
    apiKey: "AIzaSyA9wrldZI8qbqctzrValhOaRdzQQmPXXCc",
    authDomain: "messagingapp-4a1d5.firebaseapp.com",
    databaseURL: "https://messagingapp-4a1d5.firebaseio.com",
    storageBucket: "messagingapp-4a1d5.appspot.com",
    messagingSenderId: "1069621206588"
  };
  export const firebase_init = firebase.initializeApp(config);
  export const rootRef = firebase.database().ref();
  export const messaging = firebase.messaging();
