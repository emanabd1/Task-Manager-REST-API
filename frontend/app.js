const API_URL = 'http://localhost:5000/api/tasks';

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const titleInput = document.getElementById('title');
const prioritySelect = document.getElementById('priority');
const taskIdInput = document.getElementById('task-id');
const submitBtn = document.getElementById('submit-btn');


const confirmModal = document.getElementById('confirm-modal');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
let taskIdToDelete = null;


async function fetchTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}


function renderTasks(tasks) {
  taskList.innerHTML = '';
  
  if (tasks.length === 0) {
    taskList.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin: 20px 0; font-size: 14px;">All clear. Take a deep breath.</p>`;
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-card ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="task-info">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? 'checked' : ''} 
          onclick="toggleTask(${task.id}, ${!task.completed})"
        >
        <span class="badge badge-${task.priority}">${task.priority}</span>
        <span class="task-title">${task.title}</span>
      </div>
      <div class="task-actions">
        <button class="btn-icon btn-edit" onclick="startEdit(${task.id}, '${task.title}', '${task.priority}')" title="Edit">
          <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button class="btn-icon btn-delete" onclick="promptDelete(${task.id})" title="Delete">
          <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    `;
    taskList.appendChild(li);
  });
}


taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const priority = prioritySelect.value;
  const id = taskIdInput.value;

  if (!title || !priority) return;

  try {
    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority })
      });
      resetForm();
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority })
      });
      resetForm();
    }
    fetchTasks();
  } catch (error) {
    console.error('Error saving task:', error);
  }
});


function startEdit(id, title, priority) {
  taskIdInput.value = id;
  titleInput.value = title;
  prioritySelect.value = priority;
  submitBtn.textContent = 'Save';
  titleInput.focus();
}


function resetForm() {
  taskIdInput.value = '';
  titleInput.value = '';
  prioritySelect.value = '';
  submitBtn.textContent = 'Add';
}


async function toggleTask(id, completed) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    fetchTasks();
  } catch (error) {
    console.error('Error updating task status:', error);
  }
}


function promptDelete(id) {
  taskIdToDelete = id;
  confirmModal.classList.add('active');
}


function closeModal() {
  confirmModal.classList.remove('active');
  taskIdToDelete = null;
}


function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}


modalConfirmBtn.addEventListener('click', async () => {
  if (!taskIdToDelete) return;

  try {
    const response = await fetch(`${API_URL}/${taskIdToDelete}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      closeModal();
      await fetchTasks();
      showToast("Task deleted successfully!");
    } else {
      closeModal();
      showToast("Failed to delete task.");
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    closeModal();
    showToast("An error occurred.");
  }
});


modalCancelBtn.addEventListener('click', closeModal);


fetchTasks();