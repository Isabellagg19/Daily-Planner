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

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

let focusTime = 25 * 60; // 25 minutes
let breakTime = 5 * 60;  // 5 minutes
let time = focusTime;
let timerInterval;
let isRunning = false;
let onBreak = false;

function updateDisplay() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  timerDisplay.textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timerInterval = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      isRunning = false;
      if (!onBreak) {
        alert('Break timeee');
        onBreak = true;
        time = breakTime;
        startTimer(); // Break starts
      } else {
        alert('time to get back to work');
        onBreak = false;
        time = focusTime;
        updateDisplay();
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  onBreak = false;
  time = focusTime;
  updateDisplay();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();
