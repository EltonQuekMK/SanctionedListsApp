const axios = require('axios');
const xml2js = require('xml2js');
const { JSDOM } = require('jsdom');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// JSON Parser
const parseJson = async (data) => {
    return JSON.parse(data);
};

// HTML Parser
const parseHtml = async (data) => {
    const dom = new JSDOM(data);
    const document = dom.window.document;
    // Extract relevant data from HTML
    const companies = [];
    document.querySelectorAll('company').forEach((elem) => {
        companies.push(elem.textContent);
    });
    return companies;
};

// XML Parser
const parseXml = async (data) => {
    const parser = new xml2js.Parser({ explicitArray: false });
    const jsonData = await parser.parseStringPromise(data);
    return jsonData;
};

// PDF Parser
const parsePdf = async (data) => {
    const pdfData = await pdf(data);
    return pdfData.text;
};

// Parser Strategy
const parsers = {
    'application/json': parseJson,
    'text/html': parseHtml,
    'application/xml': parseXml,
    'text/xml': parseXml,
    'application/pdf': parsePdf,
};

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

        const data = await parser(response.data);

        saveData(site, data);
        saveLastUpdated(site);

        return data;
    } catch (error) {
        console.error('Error scraping data from', site.url, ':', error);
        throw error;
    }
};

const saveData = (siteData, data) => {
    // Save the data to a file
    const date = new Date().toISOString().split('T')[0];
    const sanitizedSiteName = siteData.siteName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${date}_${sanitizedSiteName}_data.json`;
    const filePath = path.join(__dirname, '../../data', fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const saveLastUpdated = (siteData) => {
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
}

module.exports = { scrapeData, saveLastUpdated };