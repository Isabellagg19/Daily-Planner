const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const monthname = document.getElementById('month-name');
const year = document.getElementById('year');
const grid = document.getElementById('calendar-grid');
const alarmSound = new Audio("sound.mp3");
const journal = document.getElementById("journal");
const saveJournal = document.getElementById("saveJournal");
const entriesContainer = document.getElementById ("entriesContainer");

const date= new Date();
const currentMonth = date.getMonth();
const currentYear = date.getFullYear();
const today = date.getDate();

//months names
const months = [
  "0", "January", "February", "March", "April", "June", 
  "July", "August", "September", "October", "November", "December"];

monthname.textContent = months[currentMonth];
year.textContent = currentYear;

//first day of the month
const firstDay= new Date (currentYear, currentMonth, 1).getDay();
//How many days 
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

for (let i = 0; i < firstDay; i++) {
  const emptyCell = document.createElement('div');
  grid.appendChild(emptyCell);
}

for (let i = 1; i <= daysInMonth; i++) {
  const dayCell = document.createElement('div');
  dayCell.textContent = i;
  if (i === today) dayCell.classList.add('today');
  grid.appendChild(dayCell)
}

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
        alarmSound.play();
        alert('Break timeee');
        onBreak = true;
        time = breakTime;
        startTimer(); // Break starts
      } else {
         alarmSound.play();
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

journal.value = localStorage.getItem("journalText") || "";

saveJournal.addEventListener("click", () => {
  localStorage.setItem("journalText", journal.value);
  alert(" Your entry has been saved!");
});

function displayEntries() {
  entriesContainer.innerHTML = "";
  entries.forEach(entry => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("entry");
    entryDiv.innerHTML = `
      <div class="entry-date">${entry.date}</div>
      <div class="entry-text">${entry.text}</div>
    `;
    entriesContainer.appendChild(entryDiv);
  });
}

let entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
function displayEntries() {
  entriesContainer.innerHTML = "";
  entries.forEach(entry => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("entry");
    entryDiv.innerHTML = `
      <div class="entry-date">${entry.date}</div>
      <div class="entry-text">${entry.text}</div>
    `;
    entriesContainer.appendChild(entryDiv);
  });
}

displayEntries();

saveJournal.addEventListener("click", () => {
  const text = journal.value.trim();
  if (text === "") {
    alert("Please write something before saving 💕");
    return;
  }

  const date = new Date().toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const newEntry = { text, date };
  entries.unshift(newEntry); 

  localStorage.setItem("journalEntries", JSON.stringify(entries));
  journal.value = "";
  displayEntries();
});