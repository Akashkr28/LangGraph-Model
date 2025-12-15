// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGep_XadFcKRP0FgJ6KwVdIBu5U7aBY9A",
  authDomain: "langbot-e8703.firebaseapp.com",
  projectId: "langbot-e8703",
  storageBucket: "langbot-e8703.firebasestorage.app",
  messagingSenderId: "1085231043492",
  appId: "1:1085231043492:web:63eb82a249b0924047e731"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();