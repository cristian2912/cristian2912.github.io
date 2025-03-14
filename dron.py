import heapq

class Grafo:
    def __init__(self):
        self.nodos = set()
        self.aristas = {}
    
    def agregar_nodo(self, valor):
        self.nodos.add(valor)
        self.aristas[valor] = []
    
    def agregar_arista(self, desde, hacia, peso):
        self.aristas[desde].append((hacia, peso))
        self.aristas[hacia].append((desde, peso))  # Si el grafo es no dirigido

    def dijkstra_con_restricciones(self, inicio, destino, zonas_interferencia, puntos_recarga):
        cola = []
        heapq.heappush(cola, (0, inicio, []))  # (costo, nodo_actual, ruta)
        visitados = set()
        
        while cola:
            (costo, nodo_actual, ruta) = heapq.heappop(cola)
            if nodo_actual not in visitados:
                visitados.add(nodo_actual)
                ruta = ruta + [nodo_actual]
                
                if nodo_actual == destino:
                    return (ruta, costo)
                
                for (vecino, peso) in self.aristas[nodo_actual]:
                    if vecino not in visitados and vecino not in zonas_interferencia:
                        if vecino in puntos_recarga:
                            # Considerar recarga (reducir el costo en 10 unidades)
                            nuevo_costo = costo + peso - 10
                        else:
                            nuevo_costo = costo + peso
                        heapq.heappush(cola, (nuevo_costo, vecino, ruta))
        
        return (None, float('inf'))  # Si no se encuentra ruta


def crear_grafo():
    grafo = Grafo()
    
    # Agregar nodos (puntos de navegación)
    grafo.agregar_nodo('A')
    grafo.agregar_nodo('B')
    grafo.agregar_nodo('C')
    grafo.agregar_nodo('D')
    grafo.agregar_nodo('E')
    grafo.agregar_nodo('F')
    
    # Agregar aristas (conexiones entre nodos con pesos)
    grafo.agregar_arista('A', 'B', 4)  # Distancia, consumo de batería, viento, etc.
    grafo.agregar_arista('A', 'C', 2)
    grafo.agregar_arista('B', 'C', 5)
    grafo.agregar_arista('B', 'D', 10)
    grafo.agregar_arista('C', 'E', 3)
    grafo.agregar_arista('E', 'D', 4)
    grafo.agregar_arista('D', 'F', 11)
    grafo.agregar_arista('E', 'F', 5)
    
    return grafo


def main():
    grafo = crear_grafo()
    
    # Definir zonas de interferencia y puntos de recarga
    zonas_interferencia = {'D'}  # Ejemplo: nodo D es una zona de interferencia
    puntos_recarga = {'C', 'E'}  # Ejemplo: nodos C y E son puntos de recarga
    
    # Entrada del usuario
    print("Puntos disponibles: A, B, C, D, E, F")
    inicio = input("Ingrese el punto de inicio: ").strip().upper()
    destino = input("Ingrese el punto de destino: ").strip().upper()
    
    # Validar entrada
    if inicio not in grafo.nodos or destino not in grafo.nodos:
        print("Error: Puntos de inicio o destino no válidos.")
        return
    
    # Calcular la ruta óptima
    ruta, costo = grafo.dijkstra_con_restricciones(inicio, destino, zonas_interferencia, puntos_recarga)
    
    # Salida esperada
    if ruta:
        print(f"\nRuta óptima: {' -> '.join(ruta)}")
        print(f"Consumo total de batería: {costo}")
    else:
        print("No se encontró una ruta válida.")


if __name__ == "__main__":
    main()
