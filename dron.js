document.getElementById('dronForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe

    const inicio = document.getElementById('startDron').value;
    const destino = document.getElementById('endDron').value;
    const resultDron = document.getElementById('resultDron');
    const rutaOptima = document.getElementById('rutaOptima');
    const consumoBateria = document.getElementById('consumoBateria');
    const desgloseConsumo = document.getElementById('desgloseConsumo');

    // Simulación de un grafo (puedes reemplazar esto con tu lógica real)
    const grafo = {
        'A': { 'B': 4, 'C': 2 },
        'B': { 'A': 4, 'C': 5, 'D': 10 },
        'C': { 'A': 2, 'B': 5, 'E': 3 },
        'D': { 'B': 10, 'E': 4, 'F': 11 },
        'E': { 'C': 3, 'D': 4, 'F': 5 },
        'F': { 'D': 11, 'E': 5 }
    };

    const { ruta, costo, desglose } = dijkstraConRestricciones(grafo, inicio, destino, new Set(['D']), new Set(['C', 'E']));

    if (ruta) {
        rutaOptima.textContent = `Ruta óptima: ${ruta.join(' -> ')}`;
        consumoBateria.textContent = `Consumo total de batería: ${costo}%`;

        // Mostrar desglose del consumo
        desgloseConsumo.innerHTML = "<h4>Desglose del consumo:</h4>";
        desglose.forEach((tramo, index) => {
            const div = document.createElement('div');
            div.className = 'consumo-tramo';
            div.textContent = `Tramo ${index + 1}: ${tramo.desde} -> ${tramo.hacia} | Consumo: ${tramo.consumo}%`;
            desgloseConsumo.appendChild(div);
        });

        // Mostrar gráfica de la ruta
        mostrarGrafica(ruta);
    } else {
        rutaOptima.textContent = "No se encontró una ruta válida.";
        consumoBateria.textContent = "";
        desgloseConsumo.innerHTML = "";
    }
});

function dijkstraConRestricciones(grafo, inicio, destino, zonasInterferencia, puntosRecarga) {
    const cola = [];
    const distancias = {};
    const rutas = {};
    const desglose = [];

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
            return { ruta: rutas[actual], costo, desglose };
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
                    desglose.push({ desde: actual, hacia: vecino, consumo: grafo[actual][vecino] });
                    cola.push({ nodo: vecino, costo: nuevoCosto });
                }
            }
        });
    }

    return { ruta: null, costo: Infinity, desglose: [] }; // Si no se encuentra ruta
}

function mostrarGrafica(ruta) {
    const ctx = document.getElementById('rutaChart').getContext('2d');
    const labels = ruta;
    const data = ruta.map((nodo, index) => index * 10); // Simulación de datos para la gráfica

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ruta Óptima',
                data: data,
                borderColor: '#007BFF',
                fill: false,
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
}
