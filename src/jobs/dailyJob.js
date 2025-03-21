const cron = require('node-cron');
const { processWebsiteScraping } = require('../utils/scraper');

// Read configuration from .env
require('dotenv').config();
const scheduleTime = process.env.SCHEDULE_TIME;

const runDailyJob = () => {
    // Schedule the job to run daily at the specified time
    cron.schedule(scheduleTime, async () => {
        await processWebsiteScraping();
    });
};

module.exports = { runDailyJob };
