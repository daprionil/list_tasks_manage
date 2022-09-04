import { dataFooter, formTask, modal, listTasks, filterTasks } from '../selectores.js';
import {delTask, editTask, viewModal, changeStateTask, textSearch} from '../funciones.js';

class ControlUI {
    //Mostrar el HTML de las tasks
    viewAllTasks({db, filter = filterTasks.value, textFilter = textSearch}) {
        //Limpiando el HTML
        this.deleteAllTasks();

        //Fragmento de Documento para agregar las notas
        const frag = document.createDocumentFragment();

        //Accediendo al Object Store
        const objectStore = db.transaction('tasks').objectStore('tasks');

        //Nos permite acceder al Arreglo de Registros
        objectStore.getAll().onsuccess = ({ target: { result } }) => {
            let arrTasks = result;

            //Filtrando los elementos por el buscador
            arrTasks = arrTasks.filter((task) => {
                if(textFilter !== ''){
                    //Cambiamos ambos datos a minisculas para compararlos
                    let text = textFilter.toLowerCase();
                    return task.textTask.toLowerCase().includes(text);
                };
                return task;
            });
            //Ordenando el arreglo, para filtrarlos
            switch (filter){
                //Ordenar las tareas desde las más recientes
                case 1:
                    arrTasks = arrTasks.sort( (a,b) => {
                        const dateA = a.date.getTime(),
                              dateB = b.date.getTime();

                        return dateB - dateA;
                    });
                    
                    break;
                //Ordenar las tareas desde la más antigua
                case 2:
                    arrTasks = arrTasks.sort( (a,b) => {
                        const dateA = a.date.getTime(),
                              dateB = b.date.getTime();

                        return dateA - dateB;
                    });
                    break;
                /**
                 * Ordenar las tareas de A-Z, por medio del Código ASCII y 
                 * el método sort, el cual funciona y ordena mejor por números.
                 */
                case 3:
                    arrTasks = arrTasks.sort( (a,b) => {
                        return a.textTask.charCodeAt(0) - b.textTask.charCodeAt(0);
                    });
                    break;
                default:
                    break;
            };

            //Si no hay ninguna nota
            if (arrTasks.length === 0) {
                const notTask = document.createElement('div');
                notTask.classList.add('not-tasks');
                notTask.textContent = 'No hay notas, ¡Agrega Una!';

                frag.appendChild(notTask);
                //Agregando el Fragmento al HTML
                listTasks.appendChild(frag);
                return;
            };

            //Mostrar las tareas
            //Iterando sobre el arrTasks
            arrTasks.forEach(task => {
                const { textTask, overviewTask, date, state } = task;

                //Extraemos los valores de la fecha
                const data = {
                    time: date.getTime(),
                    toLocaleString: date.toLocaleString(),
                };
                const {toLocaleString } = data;

                //Definiendo el HTML para cada una de las tareas
                const htmlTask = document.createElement('div');
                htmlTask.classList.add('task');
                htmlTask.innerHTML = `
                <div class="ctn-info-task">
                    <div class="ctn-left-info">
                        <div class="ctn-part">
                            <div class="ctn-title">
                                <p class="title">${textTask}</p>
                            </div>
                            <div class="ctn-state complete">
                                <form>
                                    <input type="checkbox" id="state-checkbox" name="stateTask">
                                    <p></p>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="ctn-rigth-info">
                        <div class="ctn-part">
                            <p class="descrip-task">${overviewTask}</p>
                        </div>
                    </div>
                </div>
                <div class="ctn-interactive-task">
                    <div class="ctn-btn-modal-view">
                        <button class="view-task" id="btn-viewmodal">
                         Ver Nota <span>${toLocaleString}</span>
                        </button>
                    </div>
                    <div class="ctn-options-task">
                        <button class="btn-edit-task" id="btn-edit">Editar</button>
                        <button class="btn-del-task" id="btn-del">Eliminar</button>
                    </div>
                </div>`;
                
                //Estado del checkbox en la nota
                const elementChecbox = htmlTask.querySelector('#state-checkbox');
                const stateText = state ? 'Completada': 'Pendiente';

                elementChecbox.checked = state;
                elementChecbox.nextElementSibling.textContent = stateText;
                elementChecbox.parentElement.parentElement.className = `ctn-state ${stateText}`;
                elementChecbox.onclick = () => changeStateTask(task,elementChecbox);

                //Botones para Eliminar y Editar la nota
                const btnEdit = htmlTask.querySelector('#btn-edit');
                btnEdit.onclick = () => editTask(task);
                
                const btnDel = htmlTask.querySelector('#btn-del');
                btnDel.onclick = () => delTask(task);

                //Abre la ventana modal
                const btnViewModal = htmlTask.querySelector('#btn-viewmodal');
                btnViewModal.onclick = () => viewModal(task);

                frag.appendChild(htmlTask);
            });
            //Agregando el Fragmento al HTML
            listTasks.appendChild(frag);
        };
    };
    //Delete HTML tasks
    deleteAllTasks() {
        while (listTasks.firstElementChild) {
            listTasks.firstElementChild.remove();
        };
    };

    //Mostrar mensaje de Alerta en el Formulario
    message({ m, type = 'alert' }) {
        this.deleteMessage();

        //HTML del Mensaje
        const msg = document.createElement('div');
        msg.textContent = m;
        msg.classList.add('message', `${type}`);

        //Agregando al HTML
        formTask.insertBefore(msg, formTask.lastElementChild);

        //Eliminar luego de la cantidad de Tiempo Especificada
        setTimeout(() => {
            msg.remove();
        }, 3000);
    };

    //Eliminar el Mensaje existente del HTML
    deleteMessage() {
        const msg = formTask.querySelector('.message');
        if (msg) msg.remove();
    };
    //Toggle class, ventana modal
    toggleModal() {
        modal.classList.toggle('active');
    };
    //Set Date Year Footer Page
    setDataFooter() {
        dataFooter.textContent = new Date().getFullYear();
    };
};

export default ControlUI;