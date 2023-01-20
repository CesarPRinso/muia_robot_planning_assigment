import {MapData, Distance, DistanceData} from './image-data'
import {Point, Position} from './point'
import SizeMap from './size-map'
import { Heap } from './Heap';
import { start } from 'repl';
export type Path = Array<Point>

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

const isWall = (point:Point) => (distance_arr[point.position] === Infinity)


function reconstructPath(cameFrom: Map<Point, Point>, current: Point): Path {
    const totalPath = [current];
    while (cameFrom.has(current)) {
        current = cameFrom.get(current)!;
        totalPath.unshift(current);
    }
    return totalPath;
}

function heuristic(point: Point, goal: Point) {
    // Distancia Manhattan
    console.log('Distancia Manhattan: ', Math.abs(point.i - goal.i) + Math.abs(point.j - goal.j))
    return Math.abs(point.i - goal.i) + Math.abs(point.j - goal.j)
}

export function findOptimalPathAStar(matrix:DistanceData, startPoint:Point, goalPoint:Point): Path {
    console.log(startPoint)
    const openList:Path = [startPoint]
    const closedList = new Set();
    const cameFrom = new Map();

    const gScore = new Map();
    const fScore = new Map();

    // initialize starting point
    openList.push(startPoint);
    gScore.set(startPoint, 0);
    fScore.set(startPoint, heuristic(startPoint, goalPoint));
    console.log('searchPath START: ', startPoint, matrix[startPoint.position])
    console.log('searchPath GOAL: ', goalPoint, matrix[goalPoint.position])
    console.log('gScore: ', gScore)
    console.log('gScore: ', fScore)
    //printMatrix(distance_arr, goalPoint.position, startPoint.position)
    if(matrix[startPoint.position] === 0 ){
        alert('GOAL POINT IS NOT REACHABLE')
        return []
     }
    while (openList &&  !(openList.length > 0)) {
        const currentPoint = openList.pop();
        closedList.add(currentPoint);

        if (currentPoint === goalPoint) {
            console.log("============")
            console.log(reconstructPath(cameFrom, goalPoint))
            console.log("============")
            return reconstructPath(cameFrom, goalPoint);
        }
        if(currentPoint) {
            currentPoint.neighbours.forEach((neighbour: any) => {
                if (closedList.has(neighbour)) {
                    return;
                }
                if (isWall(neighbour)) {
                    closedList.add(neighbour);
                    return;
                }
    
                const tentativeGScore = gScore.get(currentPoint) + 1; // assuming all edges have a weight of 1
                const neighbourGScore = gScore.get(neighbour) || Infinity;
                if (tentativeGScore >= neighbourGScore) {
                    return;
                }
    
                cameFrom.set(neighbour, currentPoint);
                gScore.set(neighbour, tentativeGScore);
                fScore.set(neighbour, gScore.get(neighbour) + heuristic(neighbour, goalPoint));
    
                openList.push(neighbour);
            });
        }
        
    }
    return  []; // no path was found
}



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