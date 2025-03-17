// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCo8Pbb-RL5ap5qdm-XhbWnYAwCfykpf70",
  authDomain: "iot-farm-62afd.firebaseapp.com",
  databaseURL: "https://iot-farm-62afd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-farm-62afd",
  storageBucket: "iot-farm-62afd.appspot.com",
  messagingSenderId: "113644240307",
  appId: "1:113644240307:web:27009565a78e79a8075fc6",
  measurementId: "G-72K8VSHK6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { auth, db };