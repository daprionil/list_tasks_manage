import { ui } from "../funciones.js";

export default class DBTasks{
    #DB

    constructor(){
        this.#DB = window.indexedDB.open('tasks',1);
        
        //Cuando la conexión a la base de datos es exitosa
        this.#DB.onsuccess = async (evt) => {
            this.#DB = evt.target.result;
            ui.viewAllTasks({db:this.#DB});
        };
        
        //No se  ha logrado la conexión con la base de Datos Referenciada
        this.#DB.onerror = () => {
            console.log('Ha habido un error');
        };
        //Cuando necesita ser actualiza la versión de la Base de Datos
        this.#DB.onupgradeneeded = (evt) => {
            //
            this.#DB = evt.target.result;
            const objectStore = this.#DB.createObjectStore('tasks',{
                keyPath:'id',
                autoIncrement:true
            });

            //Creando las Columnas de Nuestro Almacen de Objetos
            objectStore.createIndex('title','textTask',{unique:false});
            objectStore.createIndex('overview','overviewTask',{unique:false});
            objectStore.createIndex('state','stateTask',{unique:false});
            objectStore.createIndex('date','dateTask',{unique:false});
            objectStore.createIndex('id','id',{unique:true});
        };
    };

    get dataBase(){
        return this.#DB;
    };
};


/**
 * Quedamos iterando los valores que nos retorna la base de datos al acceder a ella
 */