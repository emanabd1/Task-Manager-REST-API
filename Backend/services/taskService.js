let tasks = require('../data/taskData');

const getAllTasks = (priorityFilter) => {
  if (priorityFilter) {
    return tasks.filter(t => t.priority.toLowerCase() === priorityFilter.toLowerCase());
  }
  return tasks;
};


const getTaskById = (id) => tasks.find(t => t.id === id);


const addTask = (title, priority, completed) => {
  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    completed: completed !== undefined ? completed : false, 
    priority
  };
  tasks.push(newTask);
  return newTask;
};


const updateTask = (id, updateData) => {
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return null;

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updateData
  };

  return tasks[taskIndex];
};


const deleteTask = (id) => {
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  return tasks.length < initialLength;
};

module.exports = {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask
};