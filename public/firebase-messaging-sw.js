importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
    apiKey: "AIzaSyBXtmJOc90xFDPNN_jMQUC6m57jbzpQnCc",
    authDomain: "emarket-a911b.firebaseapp.com",
    projectId: "emarket-a911b",
    storageBucket: "emarket-a911b.firebasestorage.app",
    messagingSenderId: "601088839701",
    appId: "1:601088839701:web:bc39c58301880612f7fe1c",
    measurementId: "G-0Q2HL71ENP"
});

const messaging = firebase.messaging();
