import ControlUI from "./Clases/ControlUI.js";
import Tasks from "./Clases/Tasks.js";
import DB from "./Clases/DB.js";
import {
    formTask, stateModal,
    titleModal, overviewModal
} from "./selectores.js";

let editando = false;
let textSearch = '';

const objTask = {
    textTask:'',
    overviewTask:''
};

const ui = new ControlUI();
const db = new DB();
const tasks = new Tasks();

//Se Ejecuta al Enviar el Formulario
function addTask(evt){
    evt.preventDefault();
    
    //Valores del Formulario
    const data = {
        textTask: evt.target.textTask.value.trim(),
        overviewTask:evt.target.overviewTask.value.trim(),
    };
    setDataObjTask(data);
    
    //Validando los campos
    if(objTask.textTask === '' && objTask.overviewTask === ''){
        ui.message({m:'Los Campos son obligatorios'});    
        return;
    };

    //Editar Tarea por medio del Modo
    if(editando){
        //Cambiando la fecha de la Tarea
        objTask.date = new Date();

        //Editando la tarea hacia la BASE DE DATOS
        tasks.editTask({...objTask})
        
        //Cambiando el modo, Seteando el BTNSUBMIT, otros...
        editando = false;
        formTask.querySelector('input[type="submit"]').value = 'Aceptar';
        formTask.reset();
        ui.message({m:'Editado Correctamente...', type:'success'});
        resetObjTask();
        return;
    };

    //Valores por defecto para las propiedades.
    objTask.date = new Date();
    objTask.state = false;
    
    //Agregando la Tarea a la BASE DE DATOS
    tasks.addTask({...objTask});
    ui.message({m: 'Agregado Correctamente',type:'success'});
    formTask.reset();
    resetObjTask();
};
//Llenar valores al Objeto Global de Tareas
function setDataObjTask(data){
    for(let val in data){
        objTask[val] = data[val];
    };
};

//Resetear objTask
function resetObjTask(){
    for(let val in objTask){
        objTask[val] = '';
    };
};

//Eliminar TAREA desde el evento del elemento
function delTask({id}){
    tasks.deleteTask(id);
};

//Edita una TAREA desde el evento del elemento
function editTask(task){
    //Llenar el Objeto Actual (objTask)
    for(let prop in task){
        objTask[prop] = task[prop];
    };
    //Mostrar valores en el Formulario
    for(let input of formTask.elements){
        if(input?.name){
            input.value = task[input.name];
        };
    };

    //Cambiando el modo
    editando = true;

    //Estilos para el Formulario
    formTask.querySelector('input[type="submit"]').value = 'Guardar Cambios';
    window.scroll(0,0);
};

//Abre la ventana modal con la información
function viewModal(task){
    const {textTask, overviewTask, state} = task;

    titleModal.textContent = textTask;
    overviewModal.textContent = overviewTask;

    const textState = state ? 'Completada': 'Pendiente';
    stateModal.textContent = textState;
    stateModal.className = `state ${textState}`;

    ui.toggleModal();
};
//Cambiar el estado de la tarea
function changeStateTask(task, checkbox){
    task.state = checkbox.checked;

    tasks.editTask(task);
};
//Filtrar por medio del Select
function viewFilterTasks(evt) {
    const value = Number(evt.target.value);
    ui.viewAllTasks({db:db.dataBase,filter:value});
};

//Buscador de notas
function searchTaks(evt) {
    evt.preventDefault();

    const [primero] = evt.target;
    
    //Añadiendo el valor del input:text del Formulario a la variable global
    textSearch = primero.value;

    //Filtrar los registros de la base de Datos
    ui.viewAllTasks({db:db.dataBase});
    
    //Reset form search
    evt.target.reset();
};
export {
    addTask,
    ui, db, tasks,
    delTask,editTask, viewModal,
    changeStateTask,viewFilterTasks,
    searchTaks,textSearch
}