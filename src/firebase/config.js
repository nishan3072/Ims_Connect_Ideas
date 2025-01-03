// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyB98HNw_dXNLLJgRzQ5w9Hb5fdvQ0ub68M",
  authDomain: "ims-connect-50d50.firebaseapp.com",
  projectId: "ims-connect-50d50",
  storageBucket: "ims-connect-50d50.firebasestorage.app",
  messagingSenderId: "783136262324",
  appId: "1:783136262324:web:45a5889a04a53d3d96afe1",
  measurementId: "G-6S2B4BWL38"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

export const db = getFirestore()