import {app} from './firebase.js'
import { getAuth , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

import { updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

let selectedFile;

// Preparar el archivo para subirlo y mostrar una vista previa
function handleFileInput() {
    const fileInput = document.getElementById('profilePic');
    selectedFile = fileInput.files[0];
    
    if (selectedFile) {
        // Mostrar una vista previa de la imagen
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImgPreview').src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    }
}

window.handleFileInput = function handleFileInput() {
    const fileInput = document.getElementById('profilePic');
    selectedFile = fileInput.files[0];
    
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImgPreview').src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    }
};

window.handleFileInput = handleFileInput;

// Esta función se dispara cuando se hace clic en el botón de actualizar foto y abre el diálogo de selección de archivos
function uploadProfilePicture() {
    document.getElementById('profilePic').click();
}

// Esta función maneja la subida inmediata del archivo seleccionado
function uploadSelectedFile() {
    if (!selectedFile) {
        alert('Por favor, selecciona un archivo antes de intentar actualizar la foto.');
        return;
    }

    const user = auth.currentUser;
    if (user) {
        // Referencia de almacenamiento con el ID del usuario y el nombre del archivo seleccionado.
        const storageReference = storageRef(storage, `profile_images/${user.uid}/${selectedFile.name}`);
        
        // Subir el archivo a Firebase Storage.
        uploadBytes(storageReference, selectedFile).then((snapshot) => {
            console.log('Uploaded an image file!', snapshot);

            // Obtener la URL de descarga del archivo subido.
            return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
            console.log('Image available at', downloadURL);

            // Actualizar el perfil del usuario en Firestore con la nueva URL de la imagen.
            const userDocRef = doc(db, "users", user.uid);
            return updateDoc(userDocRef, {
                profilePicture: downloadURL // Asegúrate de que este campo coincida con el de Firestore.
            });
        })
        .then(() => {
            // Aquí, después de que la URL se ha guardado en Firestore,
            // puedes llamar a la función para actualizar la información del perfil
            // para asegurarte de que la imagen se actualiza en la interfaz de usuario.
            console.log('Profile image URL updated in Firestore');
            updateUserProfile(user); // Esta línea es para actualizar la interfaz de usuario.
        })
        .catch((error) => {
            console.error("Error uploading file or updating Firestore", error);
        });
    } else {
        console.log('User not logged in');
    }
}


// Function to update user profile details in the DOM
function updateUserProfile(user) {
    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("Datos del usuario: ", userData);  // Diagnóstico
            document.getElementById('profileName').textContent = userData.name || 'Nombre no disponible';
            document.getElementById('profileEmail').textContent = user.email || 'Email no disponible';
            // Not advisable to display passwords in the frontend
            document.getElementById('profilePassword').textContent = user.password;
            const linkedInEl = document.getElementById('profileLinkedIn');
            if (linkedInEl) {
                linkedInEl.href = userData.linkedin || '#';
                linkedInEl.textContent = userData.linkedin ? 'Ver perfil de LinkedIn' : 'No proporcionado';
            }
            //document.getElementById().href = userData.linkedin;
            //document.getElementById().textContent = 'Perfil de LinkedIn';
            document.getElementById('profileBirthday').textContent = userData.birthday || 'Fecha de nacimiento no disponible' ;
            document.getElementById('profileDepartment').textContent = userData.department || 'Departamento no disponible';
            console.log("URL de la imagen del perfil: ", userData.profilePicture); 
            const profileImg = document.getElementById('profileImgPreview');
            if (userData.profilePicture) {
                document.getElementById('profileImgPreview').src = userData.profilePicture;
                
            }else {
                document.getElementById('profileImgPreview').src = '/img/customer01.jpg'; // imagen por defecto
            }
             // Mostrar la cantidad de monedas del usuario
             const coins = userData.coins || 1; // Asume un valor predeterminado de 1 si no está presente
             document.getElementById('profileCoins').textContent = `${coins} monedas`;

        } else {
            console.log("No se encontraron datos del usuario");
        }
    }).catch((error) => {
        console.error("ERROR AL OBTENER DATOS DE USUARIO", error);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('profilePic').addEventListener('change', handleFileInput);
    document.getElementById('saveProfilePicture').addEventListener('click', uploadSelectedFile);
    document.getElementById('updateProfilePicture').addEventListener('click', uploadProfilePicture);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            updateUserProfile(user);
        } else {
            // El usuario no ha iniciado sesión. Redirigirlos a la página de inicio de sesión.
            window.location.href = 'login.html';
        }
    });

});