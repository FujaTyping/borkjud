import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDW6DRj6-JeGTrryrscncYRw0hi2Cr0P6Q",
  authDomain: "psu-hackathon-aft.firebaseapp.com",
  projectId: "psu-hackathon-aft",
  storageBucket: "psu-hackathon-aft.firebasestorage.app",
  messagingSenderId: "53487598070",
  appId: "1:53487598070:web:f52b52d82637ec920e2fd7",
  measurementId: "G-QHE9XE0H75"
};

const app = initializeApp(firebaseConfig);
export default app