const { scrapeCompanies } = require('../../src/utils/scraper');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { JSDOM } = require('jsdom');
const pdf = require('pdf-parse');

jest.mock('axios');
jest.mock('fs');
jest.mock('path');
jest.mock('xml2js');
jest.mock('jsdom');
jest.mock('pdf-parse');

describe('scrapeCompanies', () => {
    beforeEach(() => {

    });

    afterEach(() => {

    });

    it('should parse JSON data', async () => {
        const url = 'https://example.com/companies';
        const jsonData = { companies: ['Company A', 'Company B'] };
        axios.get.mockResolvedValue({ status: 200, data: JSON.stringify(jsonData), headers: { 'content-type': 'application/json' } });

        const result = await scrapeCompanies(url);

        expect(result).toEqual(jsonData);
        expect(axios.get).toHaveBeenCalledWith(url);
    });

    it('should parse HTML data', async () => {
        const url = 'https://example.com/companies';
        const htmlData = '<html><body><company>Company A</company><company>Company B</company></body></html>';
        const companies = ['Company A', 'Company B'];
        axios.get.mockResolvedValue({ status: 200, data: htmlData, headers: { 'content-type': 'text/html' } });

        JSDOM.mockImplementation((data) => ({
            window: {
                document: {
                    querySelectorAll: jest.fn(() => [
                        { textContent: 'Company A' },
                        { textContent: 'Company B' }
                    ])
                }
            }
        }));

        const result = await scrapeCompanies(url);

        expect(result).toEqual(companies);
        expect(axios.get).toHaveBeenCalledWith(url);
    });

    it('should parse XML data', async () => {
        const url = 'https://example.com/companies';
        const xmlData = '<root><company>Company A</company><company>Company B</company></root>';
        const jsonData = { root: { company: ['Company A', 'Company B'] } };
        axios.get.mockResolvedValue({ status: 200, data: xmlData, headers: { 'content-type': 'application/xml' } });
        xml2js.Parser.mockImplementation(() => ({
            parseStringPromise: jest.fn().mockResolvedValue(jsonData),
        }));

        const result = await scrapeCompanies(url);

        expect(result).toEqual(jsonData);
        expect(axios.get).toHaveBeenCalledWith(url);
    });

    it('should parse PDF data', async () => {
        const url = 'https://example.com/companies';
        const pdfData = Buffer.from('PDF content');
        const textData = 'Company A\nCompany B';
        axios.get.mockResolvedValue({ status: 200, data: pdfData, headers: { 'content-type': 'application/pdf' } });
        pdf.mockResolvedValue({ text: textData });

        const result = await scrapeCompanies(url);

        expect(result).toEqual(textData);
        expect(axios.get).toHaveBeenCalledWith(url);
    });

    it('should throw an error for unsupported content type', async () => {
        const url = 'https://example.com/companies';
        axios.get.mockResolvedValue({ status: 200, data: 'unsupported data', headers: { 'content-type': 'unsupported/type' } });

        await expect(scrapeCompanies(url)).rejects.toThrow('Unsupported content type: unsupported/type');
    });

    // it('should scrape scs xml site', async () => {
    //     jest.resetModules(); // Reset the module registry
    //     const axios = jest.requireActual('axios')
    //     const realUrl = 'https://scsanctions.un.org/xml/en/dprk';

    //     const result = await scrapeCompanies(realUrl)
    //         .then(companies => {
    //             console.log('Scraped companies:', companies);
    //             return companies;
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //             throw error;
    //         });

    //     expect(result).toBeDefined();
    // });
});