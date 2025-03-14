# Preguntas 
1. ¿Cómo modelaste el problema como un grafo? Explica qué elementos representan los nodos y las aristas.
Modelé el problema como un grafo no dirigido, donde:

   -Nodos: Representan los puntos de navegación en la ciudad, como intersecciones o ubicaciones clave. Por ejemplo, los nodos pueden ser A, B, C, etc.     
   -Aristas: Representan las conexiones entre los nodos, es decir, los caminos que el dron puede tomar para moverse de un punto a otro. Cada arista tiene un peso que representa el consumo de batería necesario para recorrer esa ruta.

2. ¿Cómo se determinan los pesos de las conexiones entre los nodos? ¿Qué factores consideraste?
Los pesos de las conexiones se determinaron en función de:

   -Distancia: A mayor distancia entre dos nodos, mayor es el peso.

   -Consumo de batería: Cada tramo tiene un consumo de batería asociado, que depende de la distancia y otros factores como las condiciones climáticas.

   -Puntos de recarga: Si un nodo es un punto de recarga, el peso se reduce en 10% para simular la recarga de batería.

3. ¿Cómo afectó la presencia de zonas de interferencia en el cálculo de la ruta?                         
    -Las zonas de interferencia son nodos que el dron no puede atravesar. Durante el cálculo de la ruta, el algoritmo ignora completamente estos nodos. Si una ruta requiere pasar por una zona de interferencia, se considera inválida y se busca una ruta alternativa.

4. ¿Cómo implementaste el algoritmo de Dijkstra en tu solución? Explica el flujo del algoritmo paso a paso.                    
   El algoritmo de Dijkstra se implementó de la siguiente manera:

   Inicialización:

   Se crea un objeto distancias para almacenar la distancia más corta desde el nodo de inicio a cada nodo.

   Se inicializan todas las distancias como infinito (Infinity), excepto la distancia al nodo de inicio, que es 0.

   Se crea una cola de prioridad para procesar los nodos.

   Procesamiento:

   Se selecciona el nodo con la distancia más corta desde el nodo de inicio.

   Se actualizan las distancias de los nodos vecinos si se encuentra un camino más corto.

   Se repite el proceso hasta que se hayan procesado todos los nodos.

   Resultado:

   Se devuelve la ruta más corta y el consumo total de batería.

5. ¿Cómo aseguraste que el dron busque puntos de recarga si es necesario?
               
   Los puntos de recarga se modelaron como nodos especiales. Cuando el dron pasa por un punto de recarga, el consumo de batería se reduce en 10%. Esto se implementó modificando el peso de las aristas que llegan a los puntos de recarga.

6. ¿Qué estrategias utilizaste para optimizar la ejecución del algoritmo en mapas grandes?
   
   Para optimizar el algoritmo en mapas grandes, se podrían implementar las siguientes estrategias:

   Uso de una cola de prioridad eficiente: En lugar de ordenar manualmente la cola, se podría usar un montículo (heap) para mejorar la eficiencia.

   Limitación del alcance: Restringir la búsqueda a un área específica alrededor del nodo de inicio y destino.

   Preprocesamiento: Calcular rutas comunes con anticipación y almacenarlas en caché.

7. ¿Cómo modificarías el algoritmo para que tome en cuenta el viento y otras condiciones climáticas en tiempo real?
   
   Para considerar el viento y otras condiciones climáticas, se podrían:

   Ajustar los pesos de las aristas: Aumentar el peso de las aristas afectadas por viento en contra o lluvia.

   Simular condiciones dinámicas: Usar datos en tiempo real para actualizar los pesos de las aristas durante la ejecución del algoritmo.

   Incorporar un factor de riesgo: Añadir un factor adicional al peso para penalizar rutas con condiciones climáticas adversas.

8. Si se agregaran múltiples drones operando simultáneamente, ¿cómo modificarías tu solución para evitar colisiones?
   
   Para evitar colisiones entre múltiples drones, se podrían:

   Asignar rutas exclusivas: Usar un sistema de reserva de rutas para evitar que dos drones usen la misma arista al mismo tiempo.

   Introducir un sistema de prioridades: Asignar prioridades a los drones y permitir que los de mayor prioridad tengan preferencia.

   Simulación en tiempo real: Usar un sistema de monitoreo en tiempo real para ajustar las rutas dinámicamente y evitar colisiones.

9. ¿Qué mejoras podrías hacer para que la ruta se recalculase dinámicamente si un obstáculo nuevo aparece en el trayecto?
    
   Para recalcular rutas dinámicamente, se podrían:

   Implementar un sistema de detección de obstáculos: Usar sensores o datos en tiempo real para detectar obstáculos nuevos.

   Reiniciar el algoritmo: Si se detecta un obstáculo, reiniciar el algoritmo de Dijkstra desde la posición actual del dron.

   Usar algoritmos de búsqueda en tiempo real: Como D* Lite, que es más eficiente para recalcular rutas en entornos dinámicos.

10. ¿Cómo compararías Dijkstra con A para resolver este problema? ¿Cuál sería más eficiente en este caso?
    
   Dijkstra:

   Ventaja: Garantiza encontrar la ruta más corta.

   Desventaja: Es menos eficiente en mapas grandes porque explora todos los nodos sin priorizar una dirección.

   A:

   Ventaja: Es más eficiente en mapas grandes porque usa una heurística para priorizar la exploración hacia el nodo de destino.

   Desventaja: Requiere una heurística adecuada para ser eficiente.

   En este caso, A sería más eficiente, especialmente en mapas grandes, porque reduce el número de nodos explorados al dirigirse directamente hacia el destino. Sin embargo, Dijkstra es más simple y suficiente 
   para mapas pequeños o medianos.



# Documento

Explicación del Proyecto: Planificación de Rutas para Drones 

Descripción general:

Este proyecto implementa un sistema de planificación de rutas para drones en una ciudad representada como un gráfico . El objetivo es encontrar la mejor ruta entre dos puntos mientras se consideran restricciones como zonas de interferencia, puntos de recarga y condiciones de batería.

Estructura del grafo:
Cada intersección de la ciudad se representa como un nodo , y los caminos entre ellos son aristas con pesos (distancias o costos en batería).

![image](https://github.com/user-attachments/assets/c9019191-63a7-4bd5-9560-fd61b2b2af85)

Nodos y conexiones
Nodos (Intersecciones en la ciudad) :A, B, C, D, E, F
Aristas (Caminos con peso o costo) :    
A → B (4)    
A → C (2)   
B → C (5)   
B → D (10)   
C → E (3)   
D → E (4)   
D → F (11)   
E → F (5)   

Restricciones consideradas    
Zonas de Interferencia (Prohibido pasar)    

Nodo D es una zona de interferencia electromagnética .     
Los drones no pueden pasar por este nodo.    
Puntos de Recarga (Reducen el costo de la batería)   

Nodo C    
Nodo E     
Si el dron pasa por estos nodos, su costo de batería se reduce en -10 unidades.   

Cálculo de ruta     

Evita zonas prohibidas y trata de minimizar el consumo de batería.    
Se muestra la mejor ruta junto con el costo en batería.    


Ejemplo de Ejecución         
 Si el usuario ingresa:   

Inicio: A    
Destino: F    
El algoritmo busca la mejor ruta evitando D.    
Ruta óptima: A → C → E → F     
Consumo total de batería: dependerá de los cálculos    
