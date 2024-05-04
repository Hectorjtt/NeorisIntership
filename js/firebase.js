// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {  getFirestore ,collection, addDoc, getDocs, serverTimestamp, query } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"

import { getAuth , GoogleAuthProvider  , signInWithPopup,  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

//import {getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4nzOsItul2B4iLwOQVm9f7Tc-pAvfgp4",
    authDomain: "neoris-db.firebaseapp.com",
    projectId: "neoris-db",
    storageBucket: "neoris-db.appspot.com",
    messagingSenderId: "483100005526",
    appId: "1:483100005526:web:a526738468ab660b165eb7",
    measurementId: "G-QPTE1YS4DC"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, collection, addDoc, getDocs, serverTimestamp, query};

// Exportaciones previas...
export { app };

//Authentication
const auth = getAuth();
export { auth };

auth.languageCode = 'en';

const provider = new GoogleAuthProvider();
export { provider };

//Nuevas pruebas
export const registerWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};
export const signInWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

//UserLogin
/*
export const saveUserLogin = (email,password) =>{
    addDoc(collection(db,"Login"),{email, password})
}


//User SignUp
export const saveUserSignUp = (name,email,password,birthday,department) =>{
    addDoc(collection(db,"SignUp"),{name,email,password,birthday,department})
}*/
// SignUp with google
export const signUpWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
};
// Export the signInWithGoogle function to be used in the login.js file
export const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
};


// get Users

export const getUserLogin = () => getDocs(collection(db,'Login'));

export const getUserSignUp = () => getDocs(collection(db,'SignUp'));