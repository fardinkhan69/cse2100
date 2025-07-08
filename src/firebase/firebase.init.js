
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoRcPs0YeX_5kZdjH9FJzDYIDaePdVNC8",
  authDomain: "ruet-medical.firebaseapp.com",
  projectId: "ruet-medical",
  storageBucket: "ruet-medical.firebasestorage.app",
  messagingSenderId: "179674000110",
  appId: "1:179674000110:web:dce82e7803659f559ba1ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
