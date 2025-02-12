import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDzpL0ZKDhyB_r6v4fgYITQM-F1SVxIKNo",
    authDomain: "zidio-task-management.firebaseapp.com",
    projectId: "zidio-task-management",
    storageBucket: "zidio-task-management.firebasestorage.app",
    messagingSenderId: "2911528022",
    appId: "1:2911528022:web:4211c202fa483c6d1807f7",
    measurementId: "G-E0BZC3M230"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
