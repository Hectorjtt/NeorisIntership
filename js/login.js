import { signInWithGoogle, signUpWithGoogle, registerWithEmail, signInWithEmail, app } from './firebase.js';
import { doc, setDoc, getDoc, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
const db = getFirestore(app);

const signinForm = document.getElementById('signin-form');
const googleSignUpButton  = document.getElementById("signupGoogle");
const googleLoginButton  = document.getElementById("loginGoogle");
const container = document.getElementById('container');
const signupForm = document.getElementById('signup-form');

const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");});

document.addEventListener('DOMContentLoaded', function() {
    const db = getFirestore(app);

    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');

    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const userCredential = await signInWithEmail(email, password);
                console.log('User Logged In Correctly', userCredential.user);

                await addDoc(collection(db, "userSessions"), {
                    userId: userCredential.user.uid,
                    timestamp: serverTimestamp()
                });

                console.log('Session logged');
                window.location.href = 'index.html';  // Assuming this is your home page after login
            } catch (error) {
                console.error('Error during login:', error);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const birthday = document.getElementById('fechaNac').value;
            const department = document.getElementById('departamento').value;

            try {
                const userCredential = await registerWithEmail(email, password);
                console.log('User registered with email and password', userCredential.user);
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    name: name,
                    email: email,
                    birthday: birthday,
                    department: department,
                    createdAt: serverTimestamp()
                });

                console.log('User additional information saved to Firestore');
                window.location.href = 'index.html';  // Redirection after successful signup
            } catch (error) {
                console.error('Error during signup:', error);
            }
        });
    }});


    googleSignUpButton.addEventListener("click", (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del botón (navegar a un enlace).
        signUpWithGoogle()
        .then((result) => {
            // Aquí puedes manejar la redirección del usuario o la actualización de la UI.
            console.log('User signed in with Google:', result.user);
        })
        .catch((error) => {
            console.error('Error during sign in with Google:', error);
        });
    });
    
    //
    
    
    googleLoginButton.addEventListener("click", (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del botón (navegar a un enlace).
        signInWithGoogle()
        .then((result) => {
            // Aquí puedes manejar la redirección del usuario o la actualización de la UI.
            console.log('User signed in with Google:', result.user);
        })
        .catch((error) => {
            console.error('Error during sign in with Google:', error);
        });
    });