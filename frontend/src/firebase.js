// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNF2cbb2p28ygTwkxcXGUhsaNindutZ-Y",
  authDomain: "training-arc-656d3.firebaseapp.com",
  projectId: "training-arc-656d3",
  storageBucket: "training-arc-656d3.firebasestorage.app",
  messagingSenderId: "388792578624",
  appId: "1:388792578624:web:fdf0825a264af5fbf1a5a5",
  measurementId: "G-6LYRZYH7RH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);