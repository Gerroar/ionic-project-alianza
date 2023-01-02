import { indexedDBLocalPersistence, initializeAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  getDownloadURL,
  getStorage,
  ref as ref_storage,
} from "firebase/storage";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, onSnapshot } from "firebase/firestore";
//Web App's firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCE70Vz_k2jbJHVe7HJ9UBXhgiVaw-B87Y",
  authDomain: "ionic-alianza.firebaseapp.com",
  projectId: "ionic-alianza",
  storageBucket: "ionic-alianza.appspot.com",
  messagingSenderId: "116017487923",
  appId: "1:116017487923:web:682bb02a2f078bef9cc346",
  measurementId: "G-68S9N486XY",
};

//Initialize the app
const app = firebase.initializeApp(firebaseConfig);

//Create database reference
export const db = getFirestore(app);

//users Reference

export const usersRef = collection(db, "users");


//user requests Reference
export const userRequestsRef = collection(db, "requestsCount");

//getUser

export const getUser = (userId) => {
  return doc(db, "users", userId);
}

//projects Reference

export const projectsRef = collection(db, "projects")

//Storage reference
export const storage = getStorage(app);



//Create a new user

export async function newUser(userId, name, email, imageUrl) {
  let finalName = "";
  let defaultPicture;
  if (name == null) {
    finalName = email.substring(0, email.indexOf("@"));
  } else {
    finalName = name.substring(0, name.indexOf(" "));
  }

  if (imageUrl == null) {
    const imgRef = ref_storage(storage, "default-user.png");
    defaultPicture = await getDownloadURL(imgRef);
  } else {
    defaultPicture = imageUrl;
  }

  await setDoc(doc(db, "users", userId), {
    username: finalName,
    email: email,
    profile_picture: defaultPicture,
    requests: {
      requestsCount: 0,
    }
  });
}

//createNewProject

export const googleAuth = async (provider) => {
  try {
    const res = await firebase.auth().signInWithRedirect(provider);
    return res.user;
  } catch (err) {
    return console.log(err);
  }
};

export const signOut = () => {
  firebase.auth().signOut();
};

export default firebase;
