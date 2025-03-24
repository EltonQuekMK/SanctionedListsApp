const cron = require('node-cron');
const { runDailyJob } = require('./jobs/dailyJob');
const express = require('express');
const { initialize } = require('./api/webController');
const cors = require('cors');
const createLogger = require('./utils/logger');

const logger = createLogger(__filename);

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Initialize routes
initialize(app);

runDailyJob();

app.get('/', function (_req, res) {
    res.send('<h1>Server is running</h1>');
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(3000, (err) => {
    if (err) {
        logger.error('Failed to start server:', err);
    } else {
        logger.info("Server ready on port 3000.");
    }
});