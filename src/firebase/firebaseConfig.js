import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCo8Pbb-RL5ap5qdm-XhbWnYAwCfykpf70",
  authDomain: "iot-farm-62afd.firebaseapp.com",
  projectId: "iot-farm-62afd",
  storageBucket: "iot-farm-62afd.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
