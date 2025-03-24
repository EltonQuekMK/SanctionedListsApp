const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Validator } = require('jsonschema');
const { parsers } = require('./parser.js')
const { transformers } = require('./transformer.js')
const createLogger = require('./logger');

const logger = createLogger(__filename);

const processWebsiteScraping = async () => {
    const filePath = path.join(__dirname, '../../data/websites.json');

    // Read the websites.json file
    const rawData = fs.readFileSync(filePath);
    const websites = JSON.parse(rawData);

    for (const site of websites) {
        try {
            logger.info(`Scraping data from: ${site.url}`);
            const result = await scrapeData(site);
            logger.info('Scraped data');

        } catch (error) {
            logger.error(`Error scraping ${site.url}:`, error);
        }
    }
}

// Load the JSON schema
const schemaPath = path.join(__dirname, '../../data/jsonschema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

const scrapeData = async (site) => {
    try {
        let response = await axios.get(site.url);

        if (response.status !== 200) {
            throw new Error(`Request failed with status code: ${response.status}`);
        }

        const contentType = response.headers['content-type'];

        // Select the appropriate parser based on content type
        const parser = parsers[contentType];
        if (!parser) {
            throw new Error(`Unsupported content type: ${contentType}`);
        }
        // Select the appropriate transformer
        const transformer = transformers[site.transformDataFunction];
        if (!transformer) {
            throw new Error(`Unsupported transform type: ${siteData.transformDataFunction}`);
        }

        const data = transformer(await parser(response.data));

        // Validate the JSON data
        const validator = new Validator();
        const validationResult = validator.validate(data, schema);

        if (validationResult.errors.length > 0) {
            logger.error('Validation errors:', validationResult.errors.length);
            validationResult.errors.forEach(error => {
                logger.error(`Error: ${error.stack}`);
            });
            throw validationResult.toString();
        } else {
            logger.info('Json validation passed')
            saveData(site, data);
            saveLastChecked(site);
        }

        return data;
    } catch (error) {
        logger.error('Error scraping data from', site.url, ':', error);
        throw error;
    }
};

const saveData = (siteData, data) => {
    // Save the data to a file
    const filePath = path.join(__dirname, '../../data', siteData.fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    logger.info('Data saved')
}

const saveLastChecked = (siteData) => {
    const filePath = path.join(__dirname, '../../data/websites.json');
    const currentDateTime = new Date().toISOString().replace(/[:.]/g, '-');

    let websites = [];

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Read the existing data
        const rawData = fs.readFileSync(filePath);
        websites = JSON.parse(rawData);
    }

    // Find the website entry
    const websiteIndex = websites.findIndex(site => site.url === siteData.url);

    if (websiteIndex === -1) {
        // If the URL is not found, add a new entry
        // should not hit
        const siteName = new URL(siteData.url).hostname;

        websites.push({
            siteName: siteName,
            url: url,
            lastCheckedDate: currentDateTime
        });
        console.warn("Unknown website being scraped: " + siteData.url)
    } else {
        // If the URL is found, update the last updated date
        websites[websiteIndex].lastCheckedDate = currentDateTime;
    }

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(websites, null, 2));
    logger.info('lastCheckedDate updated')
}

module.exports = { processWebsiteScraping, scrapeData, saveLastChecked };