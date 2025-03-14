const grafo = crearGrafo();
const zonasInterferencia = new Set(['D']);
const puntosRecarga = new Set(['C', 'E']);

document.getElementById('calcularRuta').addEventListener('click', () => {
    const inicio = document.getElementById('startNode').value;
    const destino = document.getElementById('endNode').value;

    const { ruta, costo } = grafo.dijkstraConRestricciones(inicio, destino, zonasInterferencia, puntosRecarga);

    if (ruta) {
        document.getElementById('rutaOptima').textContent = `Ruta óptima: ${ruta.join(' -> ')}`;
        document.getElementById('consumoBateria').textContent = `Consumo de batería: ${costo}%`;
    } else {
        document.getElementById('rutaOptima').textContent = "No se encontró una ruta válida.";
        document.getElementById('consumoBateria').textContent = "";
    }
});
