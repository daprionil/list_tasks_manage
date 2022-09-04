import {db,ui} from "../funciones.js";

class Tasks{
    constructor(){
        this.listTasks = [];
    };
    //Agregar una Tarea a la BASE DE DATOS
    addTask(task){

        const transaction = db.dataBase.transaction('tasks','readwrite');
        const objectStore = transaction.objectStore('tasks');
        //Es el escucha para cuando se completa la transacción de manera exitosa
        transaction.oncomplete = () => {
            console.log('Se agregó correctamente...');
            ui.viewAllTasks({db:db.dataBase});
        };
        transaction.onerror = err => console.log(`Ha ocurrido: ${err}`);

        objectStore.add(task);
    };

    //Eliminar una Tarea de la BASE DE DATOS
    deleteTask(id){
        const transaction = db.dataBase.transaction('tasks','readwrite');
        const objectStore = transaction.objectStore('tasks');

        //Es el escucha para cuando se completa la transacción de manera exitosa
        transaction.oncomplete = () => {
            console.log('Se eliminó correctamente...');
            ui.viewAllTasks({db:db.dataBase});
        };
        transaction.onerror = err => console.log(`Ha ocurrido: ${err}`);

        objectStore.delete(id);
    };
    //Editar una Tarea de la BASE DE DATOS
    editTask(task){
        const transaction = db.dataBase.transaction('tasks','readwrite');
        const objectStore = transaction.objectStore('tasks');

        //Es el escucha para cuando se completa la transacción de manera exitosa
        transaction.oncomplete = () => {
            ui.viewAllTasks({db:db.dataBase});
        };
        transaction.onerror = err => console.log(`Ha ocurrido: ${err}`);

        objectStore.put(task);
    };
};

export default Tasks;