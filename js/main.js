// Знаходимо елементи на стр
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
//пустий масив для зберігання задач
let tasks = [];


if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}
// tasks.forEach(function (task) {
//     renderTask(task);
// })
checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);
filterOption.addEventListener("change", filterTodo);


//функції
function addTask (event) {
    // відміняємо відправку форми
    event.preventDefault();
    // дістаємо текст задачі із поля вводу
    const taskText = taskInput.value;
    //описуємо задачу у вигляді об'єкту
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };
    //додаємо задачу в масив із задачами
    tasks.push(newTask);
    // зберігаємо список задач в  сховище браузера LocalStorage
    saveToLocalStorage();

    // рендеремо задачу на стр
    renderTask(newTask);

    // очистити інпут форми і повертаємо на нього фокус
    taskInput.value = "";
    taskInput.focus();
    checkEmptyList();

}

function deleteTask (event){
    //перевіряємо що клік був НЕ на кнопці "видалення"
    if (event.target.dataset.action !== 'delete') return;

    //перевіряємо що клік був на кнопці "видалення"
    const parenNode = event.target.closest('li');
    //визначаємо ID задачі
    const id = Number(parenNode.id);

    //знаходиимо індекс задачі в масиві (1 варіант)
    //   const index = tasks.findIndex(function (task) {
    //       if (task.id === id) {
    //           return true
    //       }
    //   });
    //знаходиимо індекс задачі в масиві (2 варіант)
    // const index = tasks.findIndex(function (task) {
    //     return task.id === id;
    // });
    //знаходиимо індекс задачі в масиві (3 варіант) стрілкова функція
    // const index = tasks.findIndex((task) => task.id === id)

    // //видаляємо задачу із масива задачамии
    // tasks.splice(index, 1)

// можна було використати метод фільтр тоді splice i стрілкову функцію закоментуватии.
//         tasks = tasks.filter(function (task) {
//         if (task.id === id){
    //        return false
    //         } else{
    //         return true
    //         }
//         });

// aбо можна скоротити
    // tasks = tasks.filter(function (task) {
    //     return task.id !== id;
    // });

//  aбо можна скоротити (стрілкова функція)
    tasks = tasks.filter((task) => task.id !== id);

    // зберігаємо список задач в  сховище браузера LocalStorage
    saveToLocalStorage()

    //видаляємо задачу і розмітки
    parenNode.remove()
    if(tasks.classList[0] === "complete-btn") {
        const todo = tasks.parentElement;
        todo.classList.toggle("completed");
    }

    checkEmptyList();
}

function doneTask (event) {
    //перевіряємо що клік був НЕ на кнопці "задача виконана"
    if (event.target.dataset.action !== 'done') return;
    //перевіряємо що клік був на кнопці "задача виконана"
    const parentNode = event.target.closest('li');
    // виизначаємо  ID задачі
    const id = Number(parentNode.id);
    //знаходиимо задачу в масиві із задачамии
    // const task = tasks.find(function (task) {
    //     if (task.id === id) {
    //         return true
    //     }
    // });
    // скорочуємо запис у стрілкову функцію
    const task = tasks.find((task) => task.id === id)
    //змінює значення true/false (виконано/невиконано)
    task.done = !task.done

    // зберігаємо список задач в  сховище браузера LocalStorage
    saveToLocalStorage()

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done')
}

function checkEmptyList (event) {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                                    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                    <h3 class="h3 empty-list__title">To do list is empty</h3>
                                </li>`;
        //додаємо розмітку в список
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);

    }
    if (tasks.length > 0){
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }

}

//                                                                                      1 аргумент  (сам масив)                      2 аргумент (масиви/об'єкти потрібно трансформувати в json)
//щоб зберегти масив в localStorage потрібно виконати команду  localStorage.setItem ('по якому ключу ми хочемо записати ('tasks')', що ми хочемо записати (JSON.stringify(tasks)))
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    //формуємо css клас
    //тернарний оператор // const cssClass = умова ? if true : if false;
    const cssClass = task.done ? "task-title task-title--done" : "task-title";
    // формуємо розмітку для нової задачі
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                <span class="${cssClass}">${task.text}</span>
                <div class="task-item__buttons">
                    <button type="button" data-action="done" class="btn-action">
                        <img src="./img/tick.svg" alt="Done" width="18" height="18">
                    </button>
                    <button type="button" data-action="delete" class="btn-action">
                        <img src="./img/cross.svg" alt="Done" width="18" height="18">
                    </button>
                </div>
            </li>`
    // додаємо її на стр
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
