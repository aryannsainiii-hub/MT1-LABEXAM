// Part B: Employee Task Management REST API using Express.js

import express from 'express';

const app = express();
const PORT = 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Array used instead of a database
let tasks = [
  { id: 1, taskName: 'Develop Login Page', assignedTo: 'Rahul Sharma', status: 'Pending', priority: 'High' },
  { id: 2, taskName: 'Design Database Schema', assignedTo: 'Priya Singh', status: 'In Progress', priority: 'Medium' },
  { id: 3, taskName: 'Write Unit Tests', assignedTo: 'Amit Kumar', status: 'Completed', priority: 'Low' }
];

// GET /tasks - retrieve all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// GET /tasks/:id - retrieve a task by id
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ message: `Task with id ${req.params.id} not found` });
  }

  res.status(200).json(task);
});

// POST /tasks - add a new task
app.post('/tasks', (req, res) => {
  const { id, taskName, assignedTo, status, priority } = req.body;

  // Validate required fields
  if (id === undefined || !taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({
      message: 'id, taskName, assignedTo, status and priority are required'
    });
  }

  // Check for duplicate id
  if (tasks.some((t) => t.id === id)) {
    return res.status(409).json({ message: `Task with id ${id} already exists` });
  }

  const newTask = { id, taskName, assignedTo, status, priority };
  tasks.push(newTask);

  res.status(201).json({ message: 'Task added successfully', task: newTask });
});

// PUT /tasks/:id - update task details
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Task with id ${req.params.id} not found` });
  }

  const { taskName, assignedTo, status, priority } = req.body;

  if (!taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({
      message: 'taskName, assignedTo, status and priority are required'
    });
  }

  // Keep the original id, update the remaining fields
  tasks[index] = { id, taskName, assignedTo, status, priority };

  res.status(200).json({ message: 'Task updated successfully', task: tasks[index] });
});

// DELETE /tasks/:id - delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Task with id ${req.params.id} not found` });
  }

  const deletedTask = tasks.splice(index, 1)[0];

  res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  res.status(500).json({ message: 'Internal server error' });
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
