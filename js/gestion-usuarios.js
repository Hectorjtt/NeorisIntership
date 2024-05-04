import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc,getDoc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getFirestore, Timestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { app } from './firebase.js';

const db = getFirestore(app);

function filterCourses(filterText) {
    const tableBody = document.querySelector('section.table__body table tbody');
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const courseId = row.querySelector('td:nth-child(1)').textContent.toLowerCase(); // ID del curso está en la primera columna
        const courseName = row.querySelector('td:nth-child(2)').textContent.toLowerCase(); // Nombre del curso está en la segunda columna
        const isVisible = courseId.includes(filterText) || courseName.includes(filterText);
        row.style.display = isVisible ? '' : 'none';
    });
}

document.getElementById('toPDF').addEventListener('click', function() {
    const jsPDF = window.jspdf.jsPDF;  // Acceder correctamente al constructor de jsPDF
    const doc = new jsPDF();

    doc.autoTable({
        html: '#users_table table',  // Asegúrate de que el selector coincida con tu tabla HTML
        theme: 'grid',
        styles: { fillColor: [255, 255, 255] },  // Estilos opcionales
        columnStyles: {
            0: { fillColor: [41, 128, 185] }  // Ejemplo de color para la primera columna
        },
        margin: { top: 10 }
    });

    doc.save('usuarios.pdf');
});


document.getElementById('toJSON').addEventListener('click', function() {
    const jsonData = [];
    const rows = document.querySelectorAll('#users_table tbody tr');
    rows.forEach(row => {
        const data = {
            id: row.cells[0].innerText,
            name: row.cells[1].innerText,
            department: row.cells[2].innerText,
            coins: row.cells[3].innerText,
            courses: row.cells[4].innerText
        };
        jsonData.push(data);
    });
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "usuarios.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

document.getElementById('toCSV').addEventListener('click', function() {
    let csvContent = "data:text/csv;charset=utf-8,";
    const rows = document.querySelectorAll('#users_table table tr');
    rows.forEach(function(row) {
        let rowData = Array.from(row.querySelectorAll('td, th')).map(cell => cell.textContent);
        csvContent += rowData.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usuarios.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
});

document.getElementById('toEXCEL').addEventListener('click', function() {
    const workbook = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(document.querySelector('#users_table table'));
    XLSX.utils.book_append_sheet(workbook, ws, "Usuarios");
    XLSX.writeFile(workbook, 'usuarios.xlsx');
});



// Asegúrate de que el código se ejecute solo después de que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('searchUsersInput');
    searchInput.addEventListener('input', function() {
        // Aquí va la lógica para filtrar los cursos
        const filterText = searchInput.value.toLowerCase();
        // Suponiendo que tienes una función que filtra los cursos en la tabla
        filterCourses(filterText);
    });

    // Referencia a la colección de usuarios
    const usersCollectionRef = collection(db, "users");


    // Escuchar cambios en la colección de usuarios para contar el total de usuarios
    onSnapshot(usersCollectionRef, async(snapshot) => {
        const totalUsuariosElement = document.getElementById('totalUsuarios');
        const tableBody = document.querySelector('#users_table .table__body tbody');
        tableBody.innerHTML = '';
        if (totalUsuariosElement) {
            totalUsuariosElement.textContent = snapshot.size;
        } else {
            console.error('Elemento totalUsuarios no encontrado');
        }
            
        // Populate the table with user data
        for (const doc of snapshot.docs) {
            const user = doc.data();
            const userId = doc.id; // Firestore document ID
            const unlockedCoursesCount = await countUnlockedCourses(userId);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userId}</td>
                <td><img src="${user.profilePicture || 'img/no_usuario.png'}" alt="">${user.name}</td>
                <td>${user.department || 'Departamento no encontrado'}</td>
                <td class="centered">${user.coins || 0}</td>
                <td class="centered">${unlockedCoursesCount}</td>
                <td class="centered"><ion-icon name="trash-outline" data-id="${userId}" class="delete-icon"></ion-icon></td>
            `;
            tableBody.appendChild(row);
        }

    }, (error) => {
        console.error("Error al obtener datos de usuarios:", error);
    });

    // Obtiene la fecha actual al inicio del día
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Convertir la fecha de inicio del día en un objeto Timestamp de Firestore
    const startOfTodayTimestamp = Timestamp.fromDate(startOfToday);

    // Escuchar solo los documentos creados hoy para contar los nuevos usuarios del día
    const queryNewUsersToday = query(usersCollectionRef, where("createdAt", ">=", startOfTodayTimestamp));
    onSnapshot(queryNewUsersToday, (snapshot) => {
        const nuevosUsuariosElement = document.getElementById('nuevosUsuarios');
        if (nuevosUsuariosElement) {
            nuevosUsuariosElement.textContent = snapshot.size;
        } else {
            console.error('Elemento nuevosUsuarios no encontrado');
        }
    }, (error) => {
        console.error("Error al obtener nuevos usuarios de hoy:", error);
    });

    // Referencia a la colección de usuarios y la consulta para los activos hoy
  const queryActiveUsersToday = query(usersCollectionRef, where("lastActive", ">=", startOfTodayTimestamp));

  // Escuchar los documentos de usuarios activos hoy
  onSnapshot(queryActiveUsersToday, (snapshot) => {
    const activosUsuariosElement = document.getElementById('activosUsuarios');
    if (activosUsuariosElement) {
        activosUsuariosElement.textContent = snapshot.size;
    } else {
        console.error('Elemento activosUsuarios no encontrado');
    }
  }, (error) => {
    console.error("Error al obtener usuarios activos de hoy:", error);
  });

  async function countUnlockedCourses(userId) {
    // Reference to the user's document
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
  
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const courses = userData.courses || {}; // Retrieve user's courses
      const unlockedCourses = Object.values(courses).filter(course => course.unlocked).length; // Count unlocked courses
  
      return unlockedCourses;
    } else {
      console.log("No user data found.");
      return 0;
    }
  }

  // Agregar manejador de eventos para botones de eliminar
document.querySelector('#users_table').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-icon')) {
        const userId = event.target.getAttribute('data-id');
        if (userId && confirm("¿Estás seguro de que quieres eliminar este usuario?")) {  // Confirmación antes de eliminar
            deleteDocument(userId);
        }
    }
});

// Función para eliminar un documento de usuario
function deleteDocument(userId) {
    const userDocRef = doc(db, "users", userId);
    deleteDoc(userDocRef)
        .then(() => {
            console.log("Documento eliminado con éxito");
            // El documento se elimina de Firestore y la tabla se actualizará automáticamente a través del listener onSnapshot si está configurado para escuchar cambios
        })
        .catch((error) => {
            console.error("Error eliminando documento:", error);
        });
}
});


  // Escuchar cambios en la colección de usuarios para actualizar la tabla
  onSnapshot(usersCollectionRef, (snapshot) => {
    const tableBody = document.querySelector('#users_table .table__body tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de rellenarla

    snapshot.forEach(doc => {
        const user = doc.data();
        const userId = doc.id; // ID del documento de Firestore
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${userId}</td>
            <td><img src="${user.profilePicture || 'img/no_usuario.png'}" alt="">${user.name}</td>
            <td>${user.department || 'Departamento no encontrado'}</td>
            <td class="centered">${user.coins || 0}</td>
            <td class="centered">${user.unlockedCourses || 0}</td>
            <td class="centered"><ion-icon name="trash-outline" data-id="${userId}" class="delete-icon"></ion-icon></td>
        `;
        tableBody.appendChild(row);
    });
}, error => {
    console.error("Error al obtener datos de usuarios para la tabla:", error);
});