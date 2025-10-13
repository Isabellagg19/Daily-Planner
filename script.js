const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

document.addEventListener('DOMcontentLoaded', loadTasks);
addTaskBtn.addEventListener('click', addTask);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const li = document.createElement('li');
    li.textContent = taskText;

    li.addEventListener('click', () => {
        li.classList.toggle('done');
        saveTasks();
    });
    li.addEventListener('dblclick', () => {
        li.remove();
        saveTasks();
    })

    taskList.appendChild(li);
    taskInput.value = '';
    saveTasks();
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('tasks')) || [];
  saved.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.done) li.classList.add('done');

    li.addEventListener('click', () => {
        li.classList.toggle('done');
        saveTasks();
    });
    
    li.addEventListener('dblclick', () => {
        li.remove();
        saveTasks();
    });

    taskList.appendChild(li);
  });
}
