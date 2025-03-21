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

// Initialize routes
initialize(app);

runDailyJob();

app.get('/', function (_req, res) {
	res.send('<h1>Server is running</h1>');
});

// Start the server
app.listen(3000, () => console.log("Server ready on port 3000."));