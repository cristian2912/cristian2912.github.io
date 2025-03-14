document.getElementById('pathForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe

    const startNode = document.getElementById('startNode').value;
    const resultDiv = document.getElementById('result');

    // Simulación de un grafo (puedes reemplazar esto con tu lógica real)
    const graph = {
        'A': { 'B': 1, 'C': 4 },
        'B': { 'A': 1, 'C': 2, 'D': 5 },
        'C': { 'A': 4, 'B': 2, 'D': 1 },
        'D': { 'B': 5, 'C': 1 }
    };

    // Implementación básica de Dijkstra
    const shortestPaths = dijkstra(graph, startNode);
    resultDiv.innerHTML = `<pre>Caminos más cortos desde ${startNode}:\n${JSON.stringify(shortestPaths, null, 2)}</pre>`;
});

function dijkstra(graph, start) {
    const distances = {};
    const visited = new Set();
    const nodes = Object.keys(graph);

    // Inicializar distancias
    nodes.forEach(node => distances[node] = Infinity);
    distances[start] = 0;

    while (nodes.length) {
        // Seleccionar el nodo con la distancia mínima
        nodes.sort((a, b) => distances[a] - distances[b]);
        const closestNode = nodes.shift();

        // Si la distancia es infinita, el nodo no es alcanzable
        if (distances[closestNode] === Infinity) break;

        // Marcar el nodo como visitado
        visited.add(closestNode);

        // Actualizar las distancias de los nodos vecinos
        Object.keys(graph[closestNode]).forEach(neighbor => {
            if (!visited.has(neighbor)) {
                const newDistance = distances[closestNode] + graph[closestNode][neighbor];
                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                }
            }
        });
    }

    return distances;
}
