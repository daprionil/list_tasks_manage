import {formTask, btnModal, filterTasks, formSearch} from '../selectores.js';
import {addTask, ui,viewFilterTasks,searchTaks} from '../funciones.js';

class App{
    constructor(){
        document.addEventListener('DOMContentLoaded',() => {
            this.events();
            
            //Al Iniciar Cargará el Copy
            ui.setDataFooter();
        });
    };
    //Eventlisteners para los elementos específicos
    events(){
        formTask.addEventListener('submit', addTask);
        btnModal.addEventListener('click', ui.toggleModal);
        filterTasks.addEventListener('change', viewFilterTasks);
        formSearch.addEventListener('submit', searchTaks);
    };
};

export default App;