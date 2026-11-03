# MT1-LABEXAM - Employee Task Management

Part A: `httpServer.js` - Node.js HTTP + FS modules (port 3000)
Part B: `expressApp.js` - Express.js REST API (port 4000)

## Setup
```
npm install
```

## Run
```
node httpServer.js      # http://localhost:3000
node expressApp.js      # http://localhost:4000 (use a second terminal)
```

## Part A routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | / | Welcome message (HTML) |
| GET | /tasks | All tasks (JSON) |
| GET | /about | About page |
| GET | /home | public/index.html via fs module |
| POST | /add-task | Add task (id, taskName, assignedTo, status) |

## Part B routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | /tasks | All tasks |
| GET | /tasks/:id | Task by id |
| POST | /tasks | Add task |
| PUT | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |
