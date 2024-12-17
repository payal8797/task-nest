import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;  

// Fetch tasks linked to a specific project
export const fetchTasksByProject = async (projectId) => {
    try {
        const response = await axios.get(`${API_URL}/tasks/project/${projectId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to load tasks for the project');
    }
};

// Create a new task
export const createTask = async (taskData) => {
    try {
        const response = await axios.post(`${API_URL}/tasks`, taskData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create task');
    }
};

// Update a task by ID
export const updateTask = async (taskId, taskData) => {
    try {
        const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update task');
    }
};

// Delete a task by ID
export const deleteTask = async (taskId) => {
    try {
        await axios.delete(`${API_URL}/tasks/${taskId}`);
    } catch (error) {
        throw new Error('Failed to delete task');
    }
};

// Fetch due-today Tasks
export const fetchDueTodayTasks = async () => {
    try {
        const response = await axios.get(`${API_URL}/tasks/due-today`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to load tasks due-today');
    }
};

// Fetch upcoming Tasks
export const fetchUpcomingTasks = async () => {
    try {
        const response = await axios.get(`${API_URL}/tasks/upcoming`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to load upcoming tasks');
    }
};

// Fetch Backlog Tasks
export const fetchBacklogTasks = async () => {
    try {
        const response = await axios.get(`${API_URL}/tasks/backlog`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to load backlog tasks');
    }
};

// Fetch all Tasks
export const fetchAllTasks = async () => {
    try {
        const response = await axios.get(`${API_URL}/tasks/all-tasks`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to load backlog tasks');
    }
};

