// firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCGWsRX0s14Hs5m6SQlTDK9qInYsKQYpkc",
    authDomain: "communi-care-589c5.firebaseapp.com",
    projectId: "communi-care-589c5",
    storageBucket: "communi-care-589c5.appspot.com",
    messagingSenderId: "767068252346",
    appId: "1:767068252346:web:9c046eb6b99cc3367a7a83",
    measurementId: "G-L3RW20L0F1"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firebase Database
const db = getDatabase(app);

export { db, auth };
