// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // For database
import { getAuth } from "firebase/auth"; // For authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2M4D7GkQJdtxggbkybIm1fFSi2phnQcY",
  authDomain: "solarshare-4f21c.firebaseapp.com",
  projectId: "solarshare-4f21c",
  storageBucket: "solarshare-4f21c.appspot.com",
  messagingSenderId: "152469165696",
  appId: "1:152469165696:web:59ecbcde3bd848a6917865"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
