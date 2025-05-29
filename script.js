const addBtn = document.querySelector('.add-btn');
const input = document.querySelector('.task-input input');
const taskList = document.getElementById('taskList');
const completedList = document.getElementById('completedList');
const completeSound = document.getElementById('complete-sound');

function formatTime(date) {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleTimeString([], options);
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.task-item').forEach(taskItem => {
    tasks.push({
      text: taskItem.querySelector('.task-text').textContent,
      completed: taskItem.parentElement.id === 'completedList',
      time: taskItem.querySelector('.timestamp').textContent
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    const taskItem = createTaskElement(task.text, task.completed, task.time);
    if (task.completed) {
      completedList.appendChild(taskItem);
    } else {
      taskList.appendChild(taskItem);
    }
  });
}

function createTaskElement(text, completed = false, time = null) {
  const taskItem = document.createElement('div');
  taskItem.className = 'task-item';

  const timestamp = `<small class="timestamp">${time}</small>`;

  taskItem.innerHTML = `
    <div class="task-info">
      <input type="checkbox" class="task-check" ${completed ? 'checked' : ''}/>
      <span class="task-text">${text}</span>
    </div>
    <div class="right-side">
      ${timestamp}
      <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    </div>
  `;

  const checkbox = taskItem.querySelector('.task-check');
  const textSpan = taskItem.querySelector('.task-text');
  const deleteBtn = taskItem.querySelector('.delete-btn');
  const rightSide = taskItem.querySelector('.right-side');

  if (completed) {
    textSpan.style.textDecoration = 'line-through';
    textSpan.style.color = 'gray';
  }

  checkbox.addEventListener('change', () => {
    const isChecked = checkbox.checked;
    textSpan.style.textDecoration = isChecked ? 'line-through' : 'none';
    textSpan.style.color = isChecked ? 'gray' : 'black';

    const timeNow = formatTime(new Date());
    const timestampEl = document.createElement('small');
    timestampEl.className = 'timestamp';
    timestampEl.textContent = timeNow;
    const existingTimestamp = rightSide.querySelector('.timestamp');
    if (existingTimestamp) rightSide.replaceChild(timestampEl, existingTimestamp);

    if (isChecked) {
      completeSound.currentTime = 0;
      completeSound.play();
      completedList.appendChild(taskItem);
    } else {
      taskList.appendChild(taskItem);
    }
    saveTasks();
  });

  deleteBtn.addEventListener('click', () => {
    taskItem.remove();
    saveTasks();
  });

  return taskItem;
}

addBtn.addEventListener('click', () => {
  const taskText = input.value.trim();
  if (taskText === '') return;

  const timeNow = formatTime(new Date());
  const taskItem = createTaskElement(taskText, false, timeNow);
  taskList.appendChild(taskItem);
  input.value = '';
  saveTasks();
});

window.addEventListener('load', loadTasks);
