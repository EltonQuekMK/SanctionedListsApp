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

const scrapeCompanies = async (url) => {
    try {
        let response = await axios.get(url);

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

        // Save the data to a file
        const date = new Date().toISOString().split('T')[0];
        const website = new URL(url).hostname;
        const fileName = `companies_${website}_${date}.json`;
        const filePath = path.join(__dirname, '../../data', fileName);

        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        
        return data;
    } catch (error) {
        console.error('Error scraping companies from', url, ':', error);
        throw error;
    }
};

module.exports = { scrapeCompanies };