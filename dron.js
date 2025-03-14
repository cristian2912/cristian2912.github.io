document.getElementById('dronForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe

    const inicio = document.getElementById('startDron').value;
    const destino = document.getElementById('endDron').value;
    const resultDron = document.getElementById('resultDron');

    // Simulación de un grafo (puedes reemplazar esto con tu lógica real)
    const grafo = {
        'A': { 'B': 4, 'C': 2 },
        'B': { 'A': 4, 'C': 5, 'D': 10 },
        'C': { 'A': 2, 'B': 5, 'E': 3 },
        'D': { 'B': 10, 'E': 4, 'F': 11 },
        'E': { 'C': 3, 'D': 4, 'F': 5 },
        'F': { 'D': 11, 'E': 5 }
    };

    const { ruta, costo } = dijkstraConRestricciones(grafo, inicio, destino, new Set(['D']), new Set(['C', 'E']));

    if (ruta) {
        resultDron.innerHTML = `<pre>Ruta óptima: ${ruta.join(' -> ')}\nConsumo de batería: ${costo}%</pre>`;
    } else {
        resultDron.innerHTML = "<pre>No se encontró una ruta válida.</pre>";
    }
});

function dijkstraConRestricciones(grafo, inicio, destino, zonasInterferencia, puntosRecarga) {
    const cola = [];
    const distancias = {};
    const rutas = {};

    // Inicializar distancias y rutas
    Object.keys(grafo).forEach(nodo => {
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

        Object.keys(grafo[actual]).forEach(vecino => {
            if (!zonasInterferencia.has(vecino)) {
                let nuevoCosto = costo + grafo[actual][vecino];

                if (puntosRecarga.has(vecino)) {
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
