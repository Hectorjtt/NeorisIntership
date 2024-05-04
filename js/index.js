import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { app } from './firebase.js'

const db = getFirestore(app);
const auth = getAuth();

// Funciones adicionales para manejo de UI
function typeWriter(fullText, elementId, typingSpeed) {
    let currentIndex = 0;
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID '${elementId}' not found.`);
        return;
    }
    element.textContent = ''; // Iniciar con el contenido vacío
  
    function typeNextLetter() {
        if (currentIndex < fullText.length) {
            element.textContent += fullText.charAt(currentIndex);
            currentIndex++;
            setTimeout(typeNextLetter, typingSpeed);
        }
    }
  
    typeNextLetter();
}

function updateIndexCoins(user) {
    const userDocRef = doc(db, "users", user.uid);

    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const coins = userData.coins || 500; // Valor predeterminado de 500 monedas si no está presente
            document.getElementById('index-coins').textContent = coins;
        } else {
            console.log("No se encontraron datos del usuario.");
        }
    }).catch((error) => {
        console.error("Error al obtener datos de usuario", error);
    });
}

function updateIndexCoursesOnGoing(user) {
    const userDocRef = doc(db, "users", user.uid);

    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const courses = userData.courses || {}; // Asegúrate de que el campo 'courses' existe

            // Contar cuántos cursos tienen el estado unlocked: true
            const unlockedCoursesCount = Object.values(courses).filter(course => course.unlocked).length;

            // Actualizar el HTML con el número de cursos desbloqueados
            document.getElementById('indexCoursesOnGoing').textContent = unlockedCoursesCount;
        } else {
            console.log("No se encontraron datos del usuario.");
        }
    }).catch((error) => {
        console.error("Error al obtener datos de usuario", error);
    });
}

function updateIndexProfilePicture(user) {
    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.profilePicture) {
                document.getElementById('indexProfileImg').src = userData.profilePicture;
            }
        } else {
            console.log("No user data found.");
        }
    }).catch((error) => {
        console.error("Error fetching user data", error);
    });
}

function updateIndexUserName(user) {
    const userDocRef = doc(db, "users", user.uid);

getDoc(userDocRef).then((docSnap) => {
    if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.name) {
            typeWriter(`Bienvenido, ${userData.name}`, 'welcomeText', 150);
        }
    } else {
        console.log("No se encontraron datos del usuario.");
    }
}).catch((error) => {
    console.error("Error al obtener datos de usuario", error);
});
}

function cargarDatosGrafica(userId) {
    const q = query(collection(db, "userSessions"), where("userId", "==", userId), orderBy("timestamp", "asc"));

    onSnapshot(q, (querySnapshot) => {
        const sesiones = {};
        querySnapshot.forEach((doc) => {
            const fecha = doc.data().timestamp.toDate().toLocaleDateString();
            if (sesiones[fecha]) {
                sesiones[fecha] += 1;
            } else {
                sesiones[fecha] = 1;
            }
        });

        // Llama a la función para actualizar la gráfica con los datos nuevos
        actualizarGrafica(Object.keys(sesiones), Object.values(sesiones));
    });
}

function updateAvailableCourses(user) {
    const userDocRef = doc(db, "users", user.uid);

    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            console.log("User data found:", docSnap.data()); // Log user data
            const userData = docSnap.data();
            const courses = userData.courses || {}; // Asegúrate de que el campo 'courses' existe

            const unlockedCourses = Object.entries(courses)
                .filter(([_, courseData]) => courseData.unlocked) // Filtra solo los cursos desbloqueados
                .map(([courseId, courseData]) => ({ id: courseId, ...courseData }));

            console.log("Unlocked courses:", unlockedCourses); // Log unlocked courses

            const table = document.getElementById('availableCoursesTable');
            if (!table) {
                console.error("Table element not found!");
                return;
            }

            table.innerHTML = ''; // Limpia el contenido previo

            unlockedCourses.forEach(course => {
                console.log("Rendering course:", course); // Log course being rendered
                
                // Creando la fila y sus elementos dinámicamente
                const row = document.createElement('tr');

                const imgCell = document.createElement('td');
                imgCell.setAttribute('width', '60px');
                const imgDiv = document.createElement('div');
                imgDiv.classList.add('imgBx');
                const img = document.createElement('img');
                img.src = 'img/palomita.jpeg'; // Ruta de la imagen
                img.alt = course.id;

                imgDiv.appendChild(img);
                imgCell.appendChild(imgDiv);

                const textCell = document.createElement('td');
                const courseTitle = document.createElement('h4');
                let courseInfo = `${course.id}`;

                

                if (course.name) {
                    courseInfo += ` <br> ${course.name}`;
                }

                if (course.description) {
                    courseInfo += ` <br> <span>${course.description}</span>`;
                }

                courseTitle.innerHTML = courseInfo;

                textCell.appendChild(courseTitle);

                row.appendChild(imgCell);
                row.appendChild(textCell);

                table.appendChild(row);
            });
        } else {
            console.log("No user data found.");
        }
    }).catch((error) => {
        console.error("Error fetching user data", error);
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateIndexProfilePicture(user);
        updateIndexUserName(user);
        cargarDatosGrafica(user.uid);  // Cargar datos de la gráfica para el usuario actual
        updateIndexCoins(user);
        updateIndexCoursesOnGoing(user);
        updateAvailableCourses(user); 
        addDoc(collection(db, "userSessions"), {
            userId: user.uid,
            timestamp: serverTimestamp(),
        }).then(() => {
            console.log('Session logged');
        }).catch((error) => {
            console.error('Error logging session:', error);
        });
    } else {
        // Manejar usuario no logueado o no encontrado
        console.log("User not logged in or not found");
    }
});
