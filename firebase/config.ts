import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLMdUBjs2QdVg7Ge_pyZR6SHKpu7RKw-E",
  authDomain: "crystal-develop.firebaseapp.com",
  projectId: "crystal-develop",
  storageBucket: "crystal-develop.firebasestorage.app",
  messagingSenderId: "713419463668",
  appId: "1:713419463668:web:fbbb9d9418c5b048a177a1",
  measurementId: "G-F03JWFYPEZ"
};

// Initialize Firebase
let app;
try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    console.log('Firebase app initialized');
} catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
}

// Initialize Firebase Authentication and get a reference to the service
let auth;
try {
    auth = getAuth(app);
    console.log('Firebase Auth initialized');
} catch (error) {
    console.error('Firebase Auth initialization error:', error);
    throw error;
}

// Initialize Firestore
let db;
try {
    db = getFirestore(app);
    console.log('Firestore initialized');
} catch (error) {
    console.error('Firestore initialization error:', error);
    throw error;
}

// Initialize Storage
let storage;
try {
    storage = getStorage(app);
    console.log('Firebase Storage initialized');
} catch (error) {
    console.error('Firebase Storage initialization error:', error);
    throw error;
}

// Enable offline persistence (only in browser environment)
if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db)
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled in one tab at a time.
                console.warn("Firestore persistence failed: This can happen if you have multiple tabs of the app open. Offline mode will be disabled.");
            } else if (err.code == 'unimplemented') {
                // The current browser does not support all of the features required to enable persistence
                console.warn("Firestore persistence is not supported in this browser. The app will not work offline.");
            } else {
                console.warn("Firestore persistence error:", err);
            }
        });
}


// Initialize Analytics (only in browser environment)
if (typeof window !== 'undefined') {
    try {
        getAnalytics(app);
    } catch (error) {
        console.warn('Firebase Analytics initialization failed:', error);
    }
}

// Export the auth instance to be used in other parts of the app
export { auth, db, storage };