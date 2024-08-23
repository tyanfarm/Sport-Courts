// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAvZuRYAoDD-CXAveFk0E_ZI4Q3aH2InmE",
    authDomain: "sport-courts-ab2d8.firebaseapp.com",
    databaseURL: "https://sport-courts-ab2d8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sport-courts-ab2d8",
    storageBucket: "sport-courts-ab2d8.appspot.com",
    messagingSenderId: "1074342163660",
    appId: "1:1074342163660:web:7c660369812d3862c8be69",
    measurementId: "G-7KQQLNV494"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

const generateToken = async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
        const token = await getToken(messaging, {
            vapidKey: "BHAxqE6K2kI7F_WiiiymNMOM3NkkHxUS8Sy-jVHDp1OpgvJ6wwariYS3cqnL6Dq-J-VlJrh7GafkDqAUXTlG9iw"
        })

        return token;
    }

    return null;
}

export {messaging, generateToken}
