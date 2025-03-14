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

        // Mostrar la visualización 3D de la ruta
        mostrarRuta3D(grafo, ruta);
    } else {
        rutaOptima.textContent = "No se encontró una ruta válida.";
        consumoBateria.textContent = "";
    }
});

function mostrarRuta3D(grafo, ruta) {
    // Configuración de la escena 3D
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Añadir luces
    const light = new THREE.AmbientLight(0x404040); // Luz ambiental
    scene.add(light);

    // Crear geometrías para nodos (esferas)
    const nodeGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x0077ff });

    const nodos = {};
    const conexiones = [];

    // Posiciones de los nodos (para efectos visuales, se colocan de forma dispersa)
    const posiciones = {
        'A': new THREE.Vector3(-5, 5, 0),
        'B': new THREE.Vector3(-3, 5, 0),
        'C': new THREE.Vector3(-1, 5, 0),
        'D': new THREE.Vector3(-3, 3, 0),
        'E': new THREE.Vector3(-1, 3, 0),
        'F': new THREE.Vector3(1, 3, 0),
    };

    // Crear nodos 3D
    for (const nodo in grafo) {
        const nodoMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
        nodoMesh.position.set(posiciones[nodo].x, posiciones[nodo].y, posiciones[nodo].z);
        scene.add(nodoMesh);
        nodos[nodo] = nodoMesh;
    }

    // Crear conexiones (líneas) entre nodos
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    for (const nodo in grafo) {
        for (const vecino in grafo[nodo]) {
            const lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(nodos[nodo].position);
            lineGeometry.vertices.push(nodos[vecino].position);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
            conexiones.push(line);
        }
    }

    // Resaltar la ruta óptima en 3D
    const rutaMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    for (let i = 0; i < ruta.length - 1; i++) {
        const lineaRutaGeometry = new THREE.Geometry();
        lineaRutaGeometry.vertices.push(nodos[ruta[i]].position);
        lineaRutaGeometry.vertices.push(nodos[ruta[i + 1]].position);
        const lineaRuta = new THREE.Line(lineaRutaGeometry, rutaMaterial);
        scene.add(lineaRuta);
    }

    camera.position.z = 10;

    // Función de animación
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

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
