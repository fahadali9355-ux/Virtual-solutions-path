import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBDsTO6ZTuH0icC6VzLHO7Uw-ArQVQScwQ",
    authDomain: "virtual-solutions-path.firebaseapp.com",
    projectId: "virtual-solutions-path",
    storageBucket: "virtual-solutions-path.firebasestorage.app",
    messagingSenderId: "454450885711",
    appId: "1:454450885711:web:0cd16c367f75a5c782663a",
    measurementId: "G-YHRF1L7GXV"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
