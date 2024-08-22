// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyAvZuRYAoDD-CXAveFk0E_ZI4Q3aH2InmE",
    authDomain: "sport-courts-ab2d8.firebaseapp.com",
    databaseURL: "https://sport-courts-ab2d8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sport-courts-ab2d8",
    storageBucket: "sport-courts-ab2d8.appspot.com",
    messagingSenderId: "1074342163660",
    appId: "1:1074342163660:web:7c660369812d3862c8be69",
    measurementId: "G-7KQQLNV494"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//     console.log(
//         '[firebase-messaging-sw.js] Received background message ',
//         payload
//     );

//     // Customize notification here
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: payload.notification.image,
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
//     // self.registration.showNotification("hello");
// });