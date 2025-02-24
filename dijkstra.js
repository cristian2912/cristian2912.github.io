// dijkstra.js
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

        // Actualizar distancias de los nodos adyacentes
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

// Exportar la función para usarla en app.js
export { dijkstra };
