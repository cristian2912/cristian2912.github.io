document.getElementById('dronForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const inicio = document.getElementById('startDron').value.toUpperCase();
    const destino = document.getElementById('endDron').value.toUpperCase();
    const rutaOptima = document.getElementById('rutaOptima');
    const consumoBateria = document.getElementById('consumoBateria');

    // Definimos el grafo con distancias entre nodos
    const grafo = {
        'A': { 'B': 4, 'C': 2 },
        'B': { 'A': 4, 'C': 5, 'D': 10 },
        'C': { 'A': 2, 'B': 5, 'E': 3 },
        'D': { 'B': 10, 'E': 4, 'F': 11 },
        'E': { 'C': 3, 'D': 4, 'F': 5 },
        'F': { 'D': 11, 'E': 5 }
    };

    const zonasInterferencia = new Set(['D']); // Lugares a evitar
    const puntosRecarga = new Set(['C', 'E']); // Lugares donde se puede recargar

    // Validar entrada
    if (!grafo[inicio] || !grafo[destino]) {
        rutaOptima.textContent = "Error: Nodo de inicio o destino no válido.";
        consumoBateria.textContent = "";
        return;
    }

    // Si el destino es una zona de interferencia, el dron no puede llegar
    if (zonasInterferencia.has(destino)) {
        rutaOptima.textContent = "Error: El nodo de destino está en una zona de interferencia.";
        consumoBateria.textContent = "";
        return;
    }

    const { ruta, costo } = dijkstraConRestricciones(grafo, inicio, destino, zonasInterferencia, puntosRecarga);

    if (ruta) {
        rutaOptima.textContent = `Ruta óptima: ${ruta.join(' -> ')}`;
        consumoBateria.textContent = `Consumo total de batería: ${costo}%`;
    } else {
        rutaOptima.textContent = "No se encontró una ruta válida.";
        consumoBateria.textContent = "";
    }
});

function dijkstraConRestricciones(grafo, inicio, destino, zonasInterferencia, puntosRecarga) {
    const distancias = {};
    const rutas = {};
    const cola = [];

    // Inicializar valores
    for (let nodo in grafo) {
        distancias[nodo] = Infinity;
        rutas[nodo] = [];
    }
    distancias[inicio] = 0;
    rutas[inicio] = [inicio];

    cola.push({ nodo: inicio, costo: 0 });

    while (cola.length > 0) {
        cola.sort((a, b) => a.costo - b.costo);
        const { nodo: actual, costo } = cola.shift();

        if (actual === destino) {
            return { ruta: rutas[actual], costo };
        }

        for (let vecino in grafo[actual]) {
            if (!zonasInterferencia.has(vecino)) {
                let nuevoCosto = costo + grafo[actual][vecino];

                // Descuento de batería si es un punto de recarga
                if (puntosRecarga.has(vecino)) {
                    nuevoCosto = Math.max(nuevoCosto - 10, 0);
                }

                if (nuevoCosto < distancias[vecino]) {
                    distancias[vecino] = nuevoCosto;
                    rutas[vecino] = [...rutas[actual], vecino];
                    cola.push({ nodo: vecino, costo: nuevoCosto });
                }
            }
        }
    }

    return { ruta: null, costo: Infinity };
}
