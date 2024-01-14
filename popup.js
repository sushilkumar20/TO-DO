document.addEventListener('DOMContentLoaded', function () {
  restoreTasks();

  document.getElementById('taskInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      addTask();
    }
  });

  document.getElementById('addButton').addEventListener('click', function () {
    addTask();
  });

  document.getElementById('removeButton').addEventListener('click', function () {
    removeCompletedTasks();
  });

  document.getElementById('taskList').addEventListener('change', function (event) {
    if (event.target.type === 'checkbox') {
      updateTaskStatus(event.target.parentNode);
      if (event.target.checked) {
        celebrateAnimation(event.target.parentNode);
      }
    }
  });
});

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();

  if (taskText !== '') {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox">
      <span>${taskText}</span>
      <button class="removeTaskButton">Remove</button>
    `;
    li.querySelector('.removeTaskButton').addEventListener('click', function () {
      removeTask(this.parentNode);
    });

    taskList.appendChild(li);
    saveTasks();
    taskInput.value = '';
  }
}

function removeTask(taskElement) {
  taskElement.classList.add('celebrate'); // Apply celebration class
  setTimeout(() => {
    taskElement.parentNode.removeChild(taskElement);
    saveTasks();
  }, 1000); // Remove after 1 second
}

function removeCompletedTasks() {
  const taskList = document.getElementById('taskList');
  const completedTasks = taskList.querySelectorAll('li input[type="checkbox"]:checked');

  completedTasks.forEach(function (task) {
    // Exclude celebration animation for tasks being removed
    if (!task.parentNode.classList.contains('celebrate')) {
      celebrateAnimation(task.parentNode);
    }
    removeTask(task.parentNode);
  });

  saveTasks();
}

function saveTasks() {
  const tasks = [];
  const taskList = document.getElementById('taskList').children;

  for (const task of taskList) {
    tasks.push({
      text: task.querySelector('span').textContent,
      completed: task.querySelector('input[type="checkbox"]').checked,
    });
  }

  chrome.storage.sync.set({ tasks: tasks }, function () {
    if (chrome.runtime.lastError) {
      console.error('Error saving tasks: ' + chrome.runtime.lastError);
    }
  });
}

function restoreTasks() {
  chrome.storage.sync.get(['tasks'], function (result) {
    const tasks = result.tasks || [];
    const taskList = document.getElementById('taskList');

    for (const taskData of tasks) {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" ${taskData.completed ? 'checked' : ''}>
        <span>${taskData.text}</span>
        <button class="removeTaskButton">Remove</button>
      `;
      li.querySelector('.removeTaskButton').addEventListener('click', function () {
        removeTask(this.parentNode);
      });

      taskList.appendChild(li);
    }
  });
}

function updateTaskStatus(taskElement) {
  const checkbox = taskElement.querySelector('input[type="checkbox"]');
  const completed = checkbox.checked;

  saveTasks();

  if (completed) {
    // Do something when task is marked as completed
  } else {
    // Do something when task is marked as incomplete
  }
}

function celebrateAnimation(taskElement) {
  const burst = document.createElement('div');
  burst.classList.add('burst');

  // Set the initial position of the burst
  burst.style.left = `${Math.random() * window.innerWidth}px`;
  burst.style.top = `${Math.random() * window.innerHeight}px`;

  // Append the burst element to the body
  document.body.appendChild(burst);

  // Remove the burst element after the animation ends
  burst.addEventListener('animationend', function () {
    document.body.removeChild(burst);
  });
}
