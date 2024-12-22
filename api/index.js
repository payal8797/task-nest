// backend/api/index.js (entry point for Vercel)
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const projectRoutes = require('./projects');
const taskRoutes = require('./tasks');
const errorHandler = require('./middleware/errorHandler');
const app = express();

dotenv.config();
connectDB();
app.use(express.json());
app.use(cors());

app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);

module.exports = app; // Export the Express app
