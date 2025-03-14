// dron.js
class Grafo {
    constructor() {
        this.nodos = new Set();
        this.aristas = {};
    }

    agregarNodo(valor) {
        this.nodos.add(valor);
        this.aristas[valor] = [];
    }

    agregarArista(desde, hacia, peso) {
        this.aristas[desde].push({ nodo: hacia, peso });
        this.aristas[hacia].push({ nodo: desde, peso }); // Si el grafo es no dirigido
    }

    dijkstraConRestricciones(inicio, destino, zonasInterferencia, puntosRecarga) {
        const cola = [];
        const distancias = {};
        const rutas = {};

        // Inicializar distancias y rutas
        this.nodos.forEach(nodo => {
            distancias[nodo] = Infinity;
            rutas[nodo] = [];
        });
        distancias[inicio] = 0;
        rutas[inicio] = [inicio];

        // Usar un montículo para priorizar nodos
        cola.push({ nodo: inicio, costo: 0 });

        while (cola.length > 0) {
            cola.sort((a, b) => a.costo - b.costo); // Ordenar por costo
            const { nodo: actual, costo } = cola.shift();

            if (actual === destino) {
                return { ruta: rutas[actual], costo };
            }

            this.aristas[actual].forEach(({ nodo: vecino, peso }) => {
                if (!zonasInterferencia.has(vecino)) {
                    const nuevoCosto = costo + peso;

                    if (vecino in puntosRecarga) {
                        nuevoCosto -= 10; // Reducir costo si es un punto de recarga
                    }

                    if (nuevoCosto < distancias[vecino]) {
                        distancias[vecino] = nuevoCosto;
                        rutas[vecino] = [...rutas[actual], vecino];
                        cola.push({ nodo: vecino, costo: nuevoCosto });
                    }
                }
            });
        }

        return { ruta: null, costo: Infinity }; // Si no se encuentra ruta
    }
}

// Crear el grafo
function crearGrafo() {
    const grafo = new Grafo();
    grafo.agregarNodo('A');
    grafo.agregarNodo('B');
    grafo.agregarNodo('C');
    grafo.agregarNodo('D');
    grafo.agregarNodo('E');
    grafo.agregarNodo('F');

    grafo.agregarArista('A', 'B', 4);
    grafo.agregarArista('A', 'C', 2);
    grafo.agregarArista('B', 'C', 5);
    grafo.agregarArista('B', 'D', 10);
    grafo.agregarArista('C', 'E', 3);
    grafo.agregarArista('E', 'D', 4);
    grafo.agregarArista('D', 'F', 11);
    grafo.agregarArista('E', 'F', 5);

    return grafo;
}

// Función principal
function main() {
    const grafo = crearGrafo();
    const zonasInterferencia = new Set(['D']); // Zonas de interferencia
    const puntosRecarga = new Set(['C', 'E']); // Puntos de recarga

    const inicio = prompt("Ingrese el punto de inicio (A, B, C, D, E, F):").toUpperCase();
    const destino = prompt("Ingrese el punto de destino (A, B, C, D, E, F):").toUpperCase();

    if (!grafo.nodos.has(inicio) || !grafo.nodos.has(destino)) {
        alert("Error: Puntos de inicio o destino no válidos.");
        return;
    }

    const { ruta, costo } = grafo.dijkstraConRestricciones(inicio, destino, zonasInterferencia, puntosRecarga);

    if (ruta) {
        alert(`Ruta óptima: ${ruta.join(' -> ')}\nConsumo total de batería: ${costo}`);
    } else {
        alert("No se encontró una ruta válida.");
    }
}

// Ejecutar la función principal
main();
