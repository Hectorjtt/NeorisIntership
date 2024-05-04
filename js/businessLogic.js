import { db, collection, getDocs } from './firebase.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

async function assignCoursesToNewUser(userId) {
    console.log("Asignando cursos al nuevo usuario:", userId);

    const coursesSnapshot = await getDocs(collection(db, "courses"));
    console.log("Cursos recuperados:", coursesSnapshot.size);

    const coursesData = {};
    coursesSnapshot.forEach(courseDoc => {
        coursesData[courseDoc.id] = { unlocked: false };
        console.log("Curso añadido a coursesData:", courseDoc.id);
    });

    const userDocRef = doc(db, "users", userId);
    console.log("Actualizando documento del usuario:", userDocRef.path);

    await setDoc(userDocRef, { courses: coursesData }, { merge: true }).then(() => {
        console.log("Cursos asignados al nuevo usuario.");
    }).catch((error) => {
        console.error("Error al asignar cursos:", error);
    });
}


export { assignCoursesToNewUser };