const express = require('express');
const cron = require('node-cron');
const { runDailyJob } = require('./jobs/dailyJob');

const app = express();
const PORT = process.env.PORT || 3000;

// Schedule the daily job to run at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running daily job...');
    runDailyJob();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});