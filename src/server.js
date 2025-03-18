const cron = require('node-cron');
const { runDailyJob } = require('./jobs/dailyJob');
const express = require('express');
const { initialize } = require('./api/webController');
const cors = require('cors');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

const PORT = process.env.PORT || 3001;

// Initialize routes
initialize(app);

runDailyJob();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});