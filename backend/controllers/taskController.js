const Task = require('../models/Task');

// Create a new task
const createTask = async (req, res) => {
    try {
        const { name, description, dueDate, priority, status, project } = req.body;
        const newTask = new Task({ name, description, dueDate, priority, status, project });
        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Fetch all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('project', 'name');
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Fetch task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('project', 'name');
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Fetch tasks for a specific project
const getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId }).populate('project', 'name');
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a task
const updateTask = async (req, res) => {
    const { name, description, dueDate, priority, status, project } = req.body;
    const updatedFields = { name, description, dueDate, priority, status, project };

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        res.json({ msg: 'Task removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Tasks due today
const getTasksDueToday = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const tasks = await Task.find({
            dueDate: { $gte: today, $lt: tomorrow },
        }).sort({ dueDate: 1 });

        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Tasks upcoming in the next 3 months
const getUpcomingTasks = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(today.getMonth() + 3);

        const tasks = await Task.find({
            dueDate: { $gte: today, $lte: threeMonthsLater },
        }).sort({ dueDate: 1 });

        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Tasks in the past whose status is not 'done'
const getBacklogTasks = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tasks = await Task.find({
            status: { $in: ['todo', 'inprogress'] },
            dueDate: { $lt: today }  // Ensure dueDate is less than today
        }).populate('project', 'name');
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    getTasksByProject,
    updateTask,
    deleteTask,
    getTasksDueToday,
    getUpcomingTasks,
    getBacklogTasks,
};
