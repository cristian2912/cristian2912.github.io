function dijkstra(graph, start) {
    const distances = {};
    const visited = new Set();
    const nodes = Object.keys(graph);

    // Inicializar distancias
    nodes.forEach(node => distances[node] = Infinity);
    distances[start] = 0;

    // Cola de prioridad (usamos un array y lo ordenamos en cada iteración)
    const queue = [{ node: start, distance: 0 }];

    while (queue.length) {
        // Seleccionar el nodo con la distancia mínima
        queue.sort((a, b) => a.distance - b.distance);
        const { node: closestNode, distance: closestDistance } = queue.shift();

        // Si el nodo ya fue visitado, lo ignoramos
        if (visited.has(closestNode)) continue;

        // Marcar el nodo como visitado
        visited.add(closestNode);

        // Actualizar distancias de los nodos adyacentes
        Object.keys(graph[closestNode]).forEach(neighbor => {
            if (!visited.has(neighbor)) {
                const newDistance = closestDistance + graph[closestNode][neighbor];
                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    queue.push({ node: neighbor, distance: newDistance });
                }
            }
        });
    }

    return distances;
}

// Exportar la función para usarla en app.js
export { dijkstra };
