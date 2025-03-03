class Graph {
    constructor() {
        this.nodes = new Set();
        this.edges = {};
    }

    addNode(node) {
        this.nodes.add(node);
        this.edges[node] = {};
    }

    addEdge(node1, node2, weight) {
        this.edges[node1][node2] = weight;
        this.edges[node2][node1] = weight;
    }

    dijkstra(startNode, endNode) {
        const distances = {};
        const previous = {};
        const queue = new PriorityQueue();

        // Inicializar distancias y cola de prioridad
        this.nodes.forEach(node => {
            if (node === startNode) {
                distances[node] = 0;
                queue.enqueue(node, 0);
            } else {
                distances[node] = Infinity;
                queue.enqueue(node, Infinity);
            }
            previous[node] = null;
        });

        while (!queue.isEmpty()) {
            const currentNode = queue.dequeue().element;

            if (currentNode === endNode) {
                // Construir la ruta óptima
                const path = [];
                let node = endNode;
                while (node !== null) {
                    path.unshift(node);
                    node = previous[node];
                }
                return { path, totalBatteryConsumption: distances[endNode] };
            }

            if (currentNode || distances[currentNode] !== Infinity) {
                for (let neighbor in this.edges[currentNode]) {
                    const weight = this.edges[currentNode][neighbor];
                    const totalWeight = distances[currentNode] + weight;

                    if (totalWeight < distances[neighbor]) {
                        distances[neighbor] = totalWeight;
                        previous[neighbor] = currentNode;
                        queue.enqueue(neighbor, totalWeight);
                    }
                }
            }
        }

        return { path: null, totalBatteryConsumption: Infinity };
    }
}

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift();
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

// Ejemplo de uso
const graph = new Graph();

// Agregar nodos (puntos de navegación)
graph.addNode("A");
graph.addNode("B");
graph.addNode("C");
graph.addNode("D");
graph.addNode("E");

// Agregar aristas (conexiones entre nodos) con pesos basados en distancia, condiciones climáticas y consumo de batería
graph.addEdge("A", "B", 4);
graph.addEdge("A", "C", 2);
graph.addEdge("B", "C", 5);
graph.addEdge("B", "D", 10);
graph.addEdge("C", "D", 3);
graph.addEdge("D", "E", 7);
graph.addEdge("C", "E", 8);

// Punto de inicio y destino del dron
const startNode = "A";
const endNode = "E";

// Encontrar la ruta óptima
const result = graph.dijkstra(startNode, endNode);

if (result.path) {
    console.log("Ruta óptima:", result.path.join(" -> "));
    console.log("Consumo total de batería:", result.totalBatteryConsumption);
} else {
    console.log("No se encontró una ruta válida.");
}
