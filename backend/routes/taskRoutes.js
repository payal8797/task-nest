const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Routes
router.get('/due-today', taskController.getTasksDueToday);
router.get('/upcoming', taskController.getUpcomingTasks);
router.get('/backlog', taskController.getBacklogTasks);
router.get('/all-tasks', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.get('/project/:projectId', taskController.getTasksByProject);

router.post('/', taskController.createTask);

router.put('/:id', taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

module.exports = router;
