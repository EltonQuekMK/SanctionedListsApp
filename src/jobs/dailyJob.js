const cron = require('node-cron');
const { scrapeData } = require('../utils/scraper');
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
        const filePath = path.join(__dirname, 'data/websites.json');

        // Read the websites.json file
        const rawData = fs.readFileSync(filePath);
        const websites = JSON.parse(rawData);

        for (const site of websites) {
            try {
                console.log(`Scraping data from: ${site.url}`);
                const result = await scrapeData(site);
                console.log('Scraped data');

            } catch (error) {
                console.error(`Error scraping ${site.url}:`, error);
            }
        }
    });
};

module.exports = { runDailyJob };