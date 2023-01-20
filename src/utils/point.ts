/**
 * Este código define la clase Point, que representa un punto en un mapa bidimensional. 
 * La clase tiene los atributos "i" y "j", que representan las coordenadas del punto en el eje x e y respectivamente. 
 * También se importa la clase "SizeMap", que es utilizada para obtener el tamaño del mapa.

La clase tiene varios métodos estáticos, como FROM_POS, FROM_CLICK, POS_FROM_POINT y POINT_IN_RANGE, 
que permiten crear una instancia de Point a partir de una posición en un arreglo unidimensional, 
un objeto click y verificar si un punto está dentro del rango del mapa.

La clase también tiene un método getter "position" que devuelve la posición en un arreglo unidimensional de un punto dado y 
un método getter "inRange" que verifica si un punto está dentro del rango del mapa. Además, tiene un método getter "neighbours" 
que devuelve un arreglo de puntos vecinos (arriba, abajo, izquierda, derecha) de un punto dado.
 */

import SizeMap from './size-map'
import { Click } from './click';

export type Position = number

export class Point {
    i: number;
    j: number;

    constructor(i:number,j:number) {
        this.i = i;
        this.j = j;
    }

    static FROM_POS(x:number){
        const a = SizeMap.getInstance().a
        var i = Math.floor((x)/a)
        var j = x-a*i
        return new Point(i, j)
    }
    static FROM_CLICK(click:Click, canvas:HTMLCanvasElement){
        const i = click.y-canvas.offsetTop
        const j = click.x-canvas.offsetLeft
        return new Point(i,j)
    }

    static POS_FROM_POINT(p:Point){
        const a = SizeMap.getInstance().a
        return p.i*a+p.j
    }
    static POINT_IN_RANGE(p:Point){
        const a = SizeMap.getInstance().a
        const b = SizeMap.getInstance().b
        return p.i>= 0 && p.i < a && p.j>= 0 && p.j < b
    }

    get position(){
        return Point.POS_FROM_POINT(this)
    }
    get inRange(){
       return Point.POINT_IN_RANGE(this)
    }

    get neighbours(){
        return [
            // UP
            new Point(this.i-1,this.j),
            // LEFT
            new Point(this.i,this.j-1),
            // RIGHT
            new Point(this.i,this.j+1),
            // DOWN
            new Point(this.i+1,this.j),
        ]
    }

}
