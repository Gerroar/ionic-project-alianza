import { initializeApp } from "firebase/app";

//Web App's firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyCE70Vz_k2jbJHVe7HJ9UBXhgiVaw-B87Y",
    authDomain: "ionic-alianza.firebaseapp.com",
    projectId: "ionic-alianza",
    storageBucket: "ionic-alianza.appspot.com",
    messagingSenderId: "116017487923",
    appId: "1:116017487923:web:682bb02a2f078bef9cc346",
    measurementId: "G-68S9N486XY"
  };

  //Initialize Firebase
  const app = initializeApp(firebaseConfig);