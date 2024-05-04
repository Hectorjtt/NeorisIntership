// Chart 1
const ctx = document.getElementById('line');

  const line = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [{
        label: '# De Sesiones Activas',
        data: [8, 10, 3, 5, 2, 3],
        borderWidth: 1,
        borderColor: 'rgb(27, 36, 42)'
      }]
    },
    options: {
        maintainAspectRatio: false, // Esto permite que el gráfico ignore el aspect ratio del canvas
        responsive: true, // Asegura que el gráfico sea responsive
        aspectRatio: 1, // Cambia esto para afectar la relación de aspecto del gráfico
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  

  // Chart 2
  const ctx2 = document.getElementById('line2');

  const line2 = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [{
        label: '# Monedas totales',
        data: [14, 18, 8, 12, 2, 20],
        borderColor: 'rgb(27, 36, 42)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  

  const ctx3 = document.getElementById('line3');

  const line3 = new Chart(ctx3, {
    type: 'line',
    data: {
      labels: ['Nivel1', 'Nivel2', 'Nivel3', 'Nivel4', 'Nivel5', 'Nivel6'],
      datasets: [{
        label: '# Minutos totales',
        data: [14, 18, 8, 12, 2, 20],
        borderColor: 'rgb(27, 36, 42)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


  const ctx4 = document.getElementById('line4');

  const line4 = new Chart(ctx4, {
    type: 'bar',
    data: {
      labels: ['Nivel1', 'Nivel4', 'Nivel10', 'Nivel5', 'Nivel2', 'Nivel13'],
      datasets: [{
        label: '# Jugadas totales',
        data: [14, 18, 8, 12, 2, 20],
        borderColor: 'rgb(27, 36, 42)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


  const ctx5 = document.getElementById('line5');

  const line5 = new Chart(ctx5, {
    type: 'bar',
    data: {
      labels: ['Hector', 'Diego', 'Pancho', 'Kike', 'Sheccid', 'Rebeca'],
      datasets: [{
        label: '# Puntos totales',
        data: [14, 18, 8, 12, 2, 20],
        borderColor: 'rgb(27, 36, 42)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });



  const ctx6 = document.getElementById('line6');

  const line6 = new Chart(ctx6, {
    type: 'line',
    data: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [{
        label: '# Monedas totales',
        data: [14, 18, 8, 12, 2, 20],
        borderColor: 'rgb(27, 36, 42)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });