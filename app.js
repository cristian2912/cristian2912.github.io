// app.js

// Importar la función dijkstra desde dijkstra.js
import { dijkstra } from './dijkstra.js';

// Datos del grafo (puedes modificarlos según tu red social)
const graph = {
    A: { B: 1, D: 1 },
    B: { A: 1, C: 1 },
    C: { B: 1, D: 1 },
    D: { A: 1, C: 1 },
};

// Manejar el envío del formulario
document.getElementById('pathForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe

    // Obtener el nodo de inicio ingresado por el usuario
    const startNode = document.getElementById('startNode').value.trim().toUpperCase();

    // Validar que el nodo de inicio exista en el grafo
    if (!graph[startNode]) {
        alert('Nodo de inicio no válido. Introduce un nodo existente (A, B, C, D).');
        return;
    }

    // Calcular los caminos más cortos usando Dijkstra
    const distances = dijkstra(graph, startNode);

    // Mostrar los resultados en la página
    displayResults(startNode, distances);
});

// Función para mostrar los resultados en la página
function displayResults(start, distances) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h2>Resultados desde ${start}:</h2>`;

    // Recorrer las distancias y mostrarlas
    for (const [node, distance] of Object.entries(distances)) {
        resultDiv.innerHTML += `<p>${node}: ${distance === Infinity ? 'No alcanzable' : distance}</p>`;
    }
}