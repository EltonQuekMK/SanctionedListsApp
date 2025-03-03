const cron = require('node-cron');
const { scrapeCompanies } = require('../utils/scraper');
const fs = require('fs');
const path = require('path');

// Read configuration from .env
require('dotenv').config();
const scheduleTime = process.env.SCHEDULE_TIME;
const dataStoragePath = process.env.DATA_STORAGE_PATH;

// Read websites from websites.json
const websites = require('../data/websites.json').websites;

const runDailyJob = () => {
    // Schedule the job to run daily at the specified time
    cron.schedule(scheduleTime, async () => {
        try {
            let allCompanies = [];
            for (const url of websites) {
                const companies = await scrapeCompanies(url);
                allCompanies = allCompanies.concat(companies);
            }
            const filePath = path.join(__dirname, dataStoragePath);

            // Store the companies list locally
            fs.writeFileSync(filePath, JSON.stringify(allCompanies, null, 2));
            console.log('Daily job completed: Companies list updated.');
        } catch (error) {
            console.error('Error running daily job:', error);
        }
    });
};

module.exports = { runDailyJob };