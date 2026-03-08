'use client';

import { initializeApp, getApps } from "firebase/app";
import { getMessaging, onMessage, MessagePayload } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBXtmJOc90xFDPNN_jMQUC6m57jbzpQnCc",
    authDomain: "emarket-a911b.firebaseapp.com",
    projectId: "emarket-a911b",
    storageBucket: "emarket-a911b.firebasestorage.app",
    messagingSenderId: "601088839701",
    appId: "1:601088839701:web:bc39c58301880612f7fe1c",
    measurementId: "G-0Q2HL71ENP"
};

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const subscribeToFirebaseMessages = (callback: (payload: MessagePayload) => void) => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
        const messaging = getMessaging(firebaseApp);

        onMessage(messaging, (payload) => {
            callback(payload);
        });
    } else {
        console.error("Firebase Messaging is only supported in the browser.");
    }
};