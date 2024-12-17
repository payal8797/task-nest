const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();

app.use(express.json()); // Parse JSON data
app.use(cors()); // Enable CORS for all requests

app.use('/api/projects', projectRoutes); // Mount project routes
app.use('/api/tasks', taskRoutes);

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
