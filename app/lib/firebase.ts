import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDgXewYhJmi94N1pmRNPO0jb5HSpJXViBw",
  authDomain: "career-guidance-3a90f.firebaseapp.com",
  projectId: "career-guidance-3a90f",
  storageBucket: "career-guidance-3a90f.firebasestorage.app",
  messagingSenderId: "434319941129",
  appId: "1:434319941129:web:49e30a25c32a7cc55522d8",
  measurementId: "G-75FR8ML3JB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
