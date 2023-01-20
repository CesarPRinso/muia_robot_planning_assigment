import {MapData, Distance, DistanceData} from './image-data'
import {Point, Position} from './point'
import SizeMap from './size-map'
import { Heap } from './Heap';
export type Path = Array<Point>
// const TEST_M1 = [
//     0,'x','x',0,
//     0,'x','x',0,
//     0,'x','x',0,
//     0, 0,  0, 0,
//     ].map(e => e==='x'?Infinity:e) as Array<0|1>
/*

código exporta dos funciones, grassFire() y searchPath(), 
que son utilizadas para calcular la distancia desde un punto de destino en un mapa y 
encontrar un camino hacia el punto de destino, respectivamente. La función grassFire() 
utiliza el algoritmo "grass fire", que explora el mapa comenzando desde el punto de destino y 
asigna un valor de distancia a cada punto en el mapa basado en su proximidad al punto de destino. 
La función searchPath() luego utiliza los valores de distancia calculados por la función grassFire() 
para buscar el camino más corto desde el punto de inicio al punto de destino moviéndose hacia el
 punto vecino con el valor de distancia más pequeño en cada paso. Además, 
 hay varias funciones y variables de ayuda definidas para ayudar con la implementación de estas dos funciones.
*/
    
type VisitedMap = Array<true|false>
let distance_arr:DistanceData = []
let visited_arr:VisitedMap = new Array(distance_arr.length).fill(false)
export const setAuxiliarArrays = (matrix:MapData):[DistanceData, VisitedMap] => {
    // SizeMap.getInstance().setSize(4, 4)
    // distance_arr = [...TEST_M1].map(e=>e? Infinity: e)//[...matrix].map(e=>e? Infinity: e)
    distance_arr = [...matrix].map(e=>e===1? Infinity: e)
    visited_arr = new Array(distance_arr.length).fill(false)
    return [distance_arr, visited_arr]
}


function visited(position:number){
    return visited_arr[position]
}
function visit(position:number){
    visited_arr[position] = true
}
function visited_point(point:Point){
    return visited(point.position)
}

const isWall = (point:Point) => (distance_arr[point.position] === Infinity)

/**
 * Calculate distance in a map following the GRASS FIRE ALGORITHM
 * @param matrix 
 * @param goalPoint 
 */
/**
 * implementación del algoritmo GrassFire para calcular la distancia entre cada punto en un mapa 2D y 
 * un punto objetivo específico. La función "grassFire" recibe dos parámetros: "matrix" es el mapa 2D en sí, 
 * donde cada punto es representado por un número (1 para espacios vacíos, 0 para paredes), y "goalPoint" 
 * es el punto objetivo al cual se desea calcular la distancia.
La función comienza creando dos arreglos auxiliares: "distance_arr" 
es un arreglo que almacenará la distancia desde cada punto del mapa hasta el punto objetivo, 
y "visited_arr" es un arreglo booleano que indica si cada punto ha sido visitado o no. 
El arreglo "distance_arr" se inicializa con infinito para todos los puntos que son paredes 
(es decir, aquellos que tienen un valor de 1 en el mapa) y con 0 para el punto objetivo.
Luego, la función utiliza un ciclo "while" para explorar los puntos adyacentes al punto objetivo, actualizando la distancia en el arreglo "distance_arr" 
y agregando los puntos adyacentes no visitados a una lista "nextPointsToExplore
 */
export function grassFire(matrix:MapData, goalPoint:Point, startPoint:Point):DistanceData{
    console.log('StartPoing: ', startPoint)
    console.log('Valor en la matriz: ', matrix[startPoint.position])
    const [distance_arr, ] = setAuxiliarArrays(matrix)
    var nextPointsToExplore = [goalPoint]

    while (nextPointsToExplore.length > 0){
        var currentPoint:Point = nextPointsToExplore.shift() as Point
        var currentPosition:Position = currentPoint.position
        var currentDistance:Distance = distance_arr[currentPosition]
        // eslint-disable-next-line no-loop-func
        !visited_point(currentPoint) && currentPoint.neighbours.forEach(n => {
            if (n.inRange && !visited_point(n) && !isWall(n)){
                distance_arr[n.position] = currentDistance +1
                nextPointsToExplore.push(n)
            }
        })
        visit(currentPosition)
        printMatrix(distance_arr, goalPoint.position)
    }
    return distance_arr
}


/**
 * SEARCH PATH similar to gradient descent, searching for the minimum neighbour point each time
 * @param grassFireMatrix 
 * @param startPoint 
 * @param goalPoint 
 * 
 * La función searchPath se encarga de encontrar el camino más corto entre dos puntos (startPoint y goalPoint) 
 * en una matriz dada (grassFireMatrix) utilizando el algoritmo de búsqueda de costo uniforme.
La función comienza asignando el punto de inicio a una lista llamada pathPoints y declarando 
variables como goalReached, isReachable y currentPoint con valores iniciales específicos. 
Luego verifica si es posible llegar al punto objetivo, si no es posible, retorna un arreglo vacío.
Dentro de un ciclo while, la función se mueve desde el punto de inicio hasta el punto objetivo, 
evaluando en cada iteración los vecinos del punto actual y eligiendo el vecino con la distancia más corta 
(menor) desde el punto de inicio hasta ese vecino. El punto actual se actualiza al vecino elegido y 
se agrega al arreglo pathPoints. Si el punto actual es igual al punto objetivo, significa que se ha encontrado el camino más corto y se sale del ciclo.
La función también tiene un mecanismo de seguridad, para evitar que el ciclo while siga ejecutándose de manera infinita. 
Si el tamaño del arreglo pathPoints supera un determinado valor, retorna un arreglo vacío.
 */
export function searchPath(grassFireMatrix:DistanceData, startPoint:Point, goalPoint:Point){
    const pathPoints:Path = [startPoint]
    let goalReached = false
    let isReachable = true
    let currentPoint = startPoint
    let visitedNodes = 0
    console.log('searchPath START: ', startPoint, grassFireMatrix[startPoint.position])
    console.log('searchPath GOAL: ', goalPoint, grassFireMatrix[goalPoint.position])
    if(grassFireMatrix[startPoint.position] === 0 ){
       alert('GOAL POINT IS NOT REACHABLE')
       return []
    }
    printMatrix(grassFireMatrix, goalPoint.position, startPoint.position)
    while (!goalReached && isReachable && currentPoint.inRange){
        visitedNodes++;
        const neighbours = currentPoint.neighbours
        // eslint-disable-next-line no-loop-func
        let distances = neighbours.map(n => {
            if (n.inRange && !isWall(n)){
                return grassFireMatrix[n.position]
            }
            return Infinity
        })
        let minDistanceIndex = distances.indexOf(Math.min(...distances))
        currentPoint = neighbours[minDistanceIndex]
        pathPoints.push(currentPoint)
        if(currentPoint.i === goalPoint.i && currentPoint.j === goalPoint.j  ){
            goalReached = true
        }
        // SAFE PLACE
        if(pathPoints.length > 500000){
            return []
        }
    }
    console.log('visited nodes', visitedNodes)
    return pathPoints
}




// AUX PRINT MATRIX

export function printMatrix(m:DistanceData, GOAL_POSITION=-1, START_POSITION=-1, path:Array<Point> = []){
    if(m.length>625){
        return null
    }
    console.log('=============')
    var pathPositions = path.map(point => point.position)
    const a = SizeMap.getInstance().a
    const b = SizeMap.getInstance().b
    for (var row = 0; row < a ;row++){
        const row_elems : string[] = [];
        for (var col = 0; col < b ;col++){
            var next = row*a+col
            var charToShow = m[next]+''
            if(pathPositions.includes(next)){
                charToShow = '--'
            }
            if(START_POSITION === next){
                charToShow = 'SS'
            }else if(GOAL_POSITION === next){
                charToShow = 'GG'
            }
            row_elems.push(charToShow)
        }
         console.log(''+row_elems.map(e => e==='Infinity'?'XX':e))
    }
}