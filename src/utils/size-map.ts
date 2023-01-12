export default class SizeMap {
    private static instance: SizeMap;
    a = 0
    b = 0
    private constructor() {}
    
    public static getInstance(): SizeMap {
        if (!SizeMap.instance) {
            SizeMap.instance = new SizeMap();
        }

        return SizeMap.instance;
    }

    setSize(a:number,b:number){
        SizeMap.instance.a = a
        SizeMap.instance.b = b
    }
}

/*
Este código define la clase SizeMap, que es una clase Singleton, esto significa que solo se puede crear una instancia de la clase en toda la aplicación.
La clase tiene dos atributos "a" y "b" que representan el tamaño del mapa en el eje x e y respectivamente.
La clase tiene un método estático "getInstance" que se utiliza para obtener la única instancia de la clase. Si la instancia no ha sido creada, se crea una nueva instancia.
La clase tiene un método "setSize" que se utiliza para establecer el tamaño del mapa en los atributos "a" y "b" de la instancia.

En resumen, esta clase es utilizada para almacenar el tamaño del mapa y para obtener la instancia única de la clase en toda la aplicación.
*/