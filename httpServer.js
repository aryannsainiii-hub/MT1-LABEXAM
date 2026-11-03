
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tasks = [
  { id: 1, taskName: 'Develop Login Page', assignedTo: 'Rahul Sharma', status: 'Pending' },
  { id: 2, taskName: 'Design Database Schema', assignedTo: 'Priya Singh', status: 'In Progress' },
  { id: 3, taskName: 'Write Unit Tests', assignedTo: 'Amit Kumar', status: 'Completed' }
];

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
};

// Helper to send an HTML response
const sendHTML = (res, statusCode, html) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/html' });
  res.end(html);
};

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // ---------- GET routes ----------
  if (method === 'GET') {
    if (url === '/') {
      sendHTML(
        res,
        200,
        '<h1>Welcome to Employee Task Management Application</h1>' +
          '<p>Visit <a href="/tasks">/tasks</a>, <a href="/about">/about</a> or <a href="/home">/home</a></p>'
      );
    } else if (url === '/tasks') {
      sendJSON(res, 200, tasks);
    } else if (url === '/about') {
      sendHTML(
        res,
        200,
        '<h2>About</h2>' +
          '<p>The Employee Task Management application lets you view and add employee tasks. ' +
          'It is built with the Node.js HTTP and FS modules.</p>'
      );
    } else if (url === '/home') {
      // Serve index.html from the public folder using the fs module
      const filePath = path.join(__dirname, 'public', 'index.html');

      fs.readFile(filePath, (err, content) => {
        if (err) {
          console.error('File read error:', err.message);
          sendHTML(res, 500, '<h1>500 - Internal Server Error</h1><p>Unable to read the requested file.</p>');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      });
    } else {
      sendHTML(res, 404, '<h1>404 - Page Not Found</h1>');
    }
  }

  // ---------- POST /add-task ----------
  else if (method === 'POST' && url === '/add-task') {
    let body = '';

    // Collect data chunks of the request body
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      let newTask;

      // Handle invalid JSON
      try {
        newTask = JSON.parse(body);
      } catch (error) {
        sendJSON(res, 400, { error: 'Invalid JSON format' });
        return;
      }

      const { id, taskName, assignedTo, status } = newTask;

      // Validate required fields
      if (id === undefined || !taskName || !assignedTo || !status) {
        sendJSON(res, 400, {
          error: 'Missing required fields: id, taskName, assignedTo and status are required'
        });
        return;
      }

      // Do not allow duplicate ids
      const exists = tasks.some((task) => task.id === id);
      if (exists) {
        sendJSON(res, 409, { error: `Task with id ${id} already exists` });
        return;
      }

      const task = { id, taskName, assignedTo, status };
      tasks.push(task);

      sendJSON(res, 201, { message: 'Task added successfully', task });
    });

    req.on('error', () => {
      sendJSON(res, 400, { error: 'Invalid request' });
    });
  }

  // ---------- Known route but wrong method ----------
  else if (['/', '/tasks', '/about', '/home', '/add-task'].includes(url)) {
    sendJSON(res, 405, { error: `Method ${method} not allowed on ${url}` });
  }

  // ---------- Invalid route ----------
  else {
    sendHTML(res, 404, '<h1>404 - Page Not Found</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
