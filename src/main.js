import "./style.css";
import { createIcons, icons } from "lucide";

document.querySelector("#app").innerHTML = `
<header class="app-header">
  <h1>
    <i data-lucide="list-todo"></i>
    Atlas Task Manager
  </h1>
  <p>Stay organized. Stay productive.</p>
</header>

<div class="search-container">
  <input
    id="searchInput"
    type="text"
    placeholder="Search tasks..."
    class="search-input"
  />
</div>

<div class="input-card">
  <div class="input-container">

    <div class="input-row">

      <input
        id="taskInput"
        type="text"
        placeholder="Enter a task..."
        class="task-input"
      />

      <div class="date-input-wrapper">
        <input
          id="dueDateInput"
          type="date"
          class="date-input"
        />

        <i
          data-lucide="calendar-days"
          class="date-picker-icon"
        ></i>
      </div>

    </div>

    <button id="addTaskButton">
      <i data-lucide="plus"></i>
      Add Task
    </button>

  </div>
</div>

<ul id="taskList"></ul>

<div class="progress-card">

  <p id="taskCounter">
    0 of 0 tasks completed
  </p>

  <button
    id="clearCompletedButton"
    class="clear-btn"
  >
    <i data-lucide="eraser"></i>
    Clear Tasks
  </button>

</div>
`;

createIcons({ icons });

const taskInput = document.querySelector("#taskInput");
const dueDateInput = document.querySelector("#dueDateInput");
const searchInput = document.querySelector("#searchInput");
const addTaskButton = document.querySelector("#addTaskButton");
const clearCompletedButton = document.querySelector("#clearCompletedButton");
const taskList = document.querySelector("#taskList");
const taskCounter = document.querySelector("#taskCounter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let searchText = "";

function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

renderTasks();

searchInput.addEventListener("input", () => {
  searchText = searchInput.value.toLowerCase();
  renderTasks();
});

function renderTasks() {
  taskList.innerHTML = "";

  for (const [index, task] of tasks.entries()) {
    if (!task.text.toLowerCase().includes(searchText)) {
      continue;
    }

    taskList.innerHTML += `
      <div class="task-info">

        <input
          type="checkbox"
          ${task.completed ? "checked" : ""}
          onchange="toggleTask(${index})"
        />

        <div class="task-details">

          <span class="task-title ${task.completed ? "completed" : ""}">
            ${task.text}
          </span>

          <div class="due-date">
            ${
              task.dueDate
                ? `<i data-lucide="calendar"></i><span>${formatDate(task.dueDate)}</span>`
                : ""
            }
          </div>

        </div>

        <div class="task-actions">

          <button
            class="edit-btn"
            onclick="editTask(${index})"
          >
            <i data-lucide="square-pen"></i>
            Edit
          </button>

          <button
            class="delete-btn"
            onclick="deleteTask(${index})"
          >
            <i data-lucide="trash-2"></i>
            Delete
          </button>

        </div>

      </div>
    `;
  }

  const completedTasks = tasks.filter((task) => task.completed).length;

  if (tasks.length === 0) {
    taskCounter.textContent = "0 of 0 tasks completed";
  } else if (completedTasks === tasks.length) {
    taskCounter.textContent = "All tasks completed!";
  } else {
    taskCounter.textContent = `${completedTasks} of ${tasks.length} tasks completed`;
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  createIcons({ icons });
}

addTaskButton.addEventListener("click", () => {
  if (taskInput.value.trim() === "") {
    return;
  }

  tasks.push({
    text: taskInput.value.trim(),
    completed: false,
    dueDate: dueDateInput.value,
  });

  taskInput.value = "";
  dueDateInput.value = "";
  renderTasks();
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  renderTasks();
});

function editTask(index) {
  taskInput.value = tasks[index].text;
  tasks.splice(index, 1);
  renderTasks();
}

window.editTask = editTask;

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

window.deleteTask = deleteTask;

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

window.toggleTask = toggleTask;
