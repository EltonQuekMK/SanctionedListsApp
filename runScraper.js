const fs = require('fs');
const path = require('path');
const { scrapeData } = require('./src/utils/scraper');

const run = async () => {
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
};

run();