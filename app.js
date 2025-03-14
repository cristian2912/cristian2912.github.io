// app.js

const map = L.map('map').setView([51.505, -0.09], 13); // Coordenadas iniciales del mapa

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const grafo = crearGrafo();
const dron = new Dron();
const zonasInterferencia = new Set(['D']);
const puntosRecarga = new Set(['C', 'E']);

document.getElementById('calcularRuta').addEventListener('click', () => {
    const inicio = document.getElementById('startNode').value;
    const destino = document.getElementById('endNode').value;

    const { ruta, costo } = grafo.dijkstraConRestricciones(inicio, destino, zonasInterferencia, puntosRecarga);

    if (ruta) {
        document.getElementById('rutaOptima').textContent = `Ruta óptima: ${ruta.join(' -> ')}`;
        document.getElementById('consumoBateria').textContent = `Consumo de batería: ${costo}%`;

        // Simular condiciones climáticas
        const condicionesClimaticas = {
            viento: Math.random() > 0.5,
            lluvia: Math.random() > 0.5
        };

        dron.consumirBateria(costo, condicionesClimaticas);
        document.getElementById('condicionesClimaticas').textContent = `Condiciones climáticas: ${condicionesClimaticas.viento ? 'Viento fuerte' : 'Sin viento'}, ${condicionesClimaticas.lluvia ? 'Lluvia' : 'Sin lluvia'}`;
    } else {
        document.getElementById('rutaOptima').textContent = "No se encontró una ruta válida.";
    }
});
