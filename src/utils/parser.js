const { JSDOM } = require('jsdom');
const xml2js = require('xml2js');
const pdf = require('pdf-parse');

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
    'text/xml;charset=UTF-8': parseXml,
    'application/pdf': parsePdf,
};

module.exports = { parsers };