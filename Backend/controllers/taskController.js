const taskService = require('../services/taskService');


const getAll = (req, res) => {
  const { priority } = req.query;
  const result = taskService.getAllTasks(priority);
  res.json(result);
};


const getOne = (req, res) => {
  const id = parseInt(req.params.id);
  const task = taskService.getTaskById(id);
  
  if (!task) {
    return res.status(404).json({ message: "Task not found" }); 
  }
  res.json(task);
};


const create = (req, res) => {
  const { title, priority, completed } = req.body;
 
  if (!title || !priority) {
    return res.status(400).json({ message: "Missing required fields: title and priority are required." }); // 400 for invalid POST[cite: 3]
  }

  const newTask = taskService.addTask(title, priority, completed);
  res.status(201).json(newTask);
};


const update = (req, res) => {
  const id = parseInt(req.params.id);
  const updatedTask = taskService.updateTask(id, req.body);

  if (!updatedTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(updatedTask);
};


const remove = (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = taskService.deleteTask(id);

  if (!deleted) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted successfully" });
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove
};