const axios = require('axios');
const xml2js = require('xml2js');
const { JSDOM } = require('jsdom');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const { Validator } = require('jsonschema');

// Load the JSON schema
const schemaPath = path.join(__dirname, '../../data/jsonschema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

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


// Function to transform EU Consolidated List to UN List format
const transformEUToUN = (euData) => {
    return euData.export.sanctionEntity.map(entity => {
        const nameAlias = entity.nameAlias?.$?.wholeName ?? entity.nameAlias?.map(alias => alias.$.wholeName).join(', ');
        const nationality = entity.citizenship?.$?.countryDescription ?? entity.citizenship ? entity.citizenship.map(citizen => citizen.$.countryDescription).join(', ') : "";
        const birthdate = entity.birthdate?.$?.year;
        const address = entity.address?.$?.countryDescription ?? entity.address?.map(addr => `${addr.$.street}, ${addr.$.city}, ${addr.$.countryDescription}`).join('; ');

        return {
            DATAID: entity.$.logicalId,
            VERSIONNUM: "1", // Assuming version number is 1
            FIRST_NAME: nameAlias.split(' ')[0],
            SECOND_NAME: nameAlias.split(' ').slice(1).join(' '),
            UN_LIST_TYPE: "EU",
            REFERENCE_NUMBER: entity.$.logicalId,
            LISTED_ON: euData.export.$.generationDate.split('T')[0],
            COMMENTS1: entity.remark,
            // DESIGNATION: {
            //     VALUE: entity.nameAlias[0].$.function || ""
            // },
            NATIONALITY: {
                VALUE: nationality
            },
            LIST_TYPE: {
                VALUE: "EU List"
            },
            LAST_DAY_UPDATED: {
                VALUE: euData.export.$.generationDate.split('T')[0]
            },
            INDIVIDUAL_ALIAS: {
                QUALITY: entity.nameAlias[0]?.$.title || "",
                ALIAS_NAME: nameAlias
            },
            INDIVIDUAL_ADDRESS: {
                COUNTRY: address
            },
            INDIVIDUAL_DATE_OF_BIRTH: {
                TYPE_OF_DATE: "EXACT",
                DATE: birthdate
            },
            INDIVIDUAL_PLACE_OF_BIRTH: {
                COUNTRY: entity.birthdate.$?.countryDescription || ""
            },
            INDIVIDUAL_DOCUMENT: entity.citizenship[0]?.$.number || "",
            SORT_KEY: entity.$.logicalId,
            SORT_KEY_LAST_MOD: euData.export.$.generationDate.split('T')[0]
        };
    });
};

const notRequired = (data) => {
    return data;
}


// Transform Strategy
const transformers = {
    'notRequired': notRequired,
    'transformEUToUN': transformEUToUN
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
        // Select the appropriate transformer
        const transformer = transformers[site.transformDataFunction];
        if (!transformer) {
            throw new Error(`Unsupported transform type: ${siteData.transformDataFunction}`);
        }

        const data = transformer(await parser(response.data));

        // Validate the JSON data
        // const validator = new Validator();
        // const validationResult = validator.validate(data, schema);

        if (validationResult.errors.length > 0) {
            console.error('Validation errors:', validationResult.errors.length);
            throw error;
        } else {
            console.log('Json validation passed')
            saveData(site, data);
            saveLastChecked(site);
        }

        return data;
    } catch (error) {
        console.error('Error scraping data from', site.url, ':', error);
        throw error;
    }
};

const saveData = (siteData, data) => {
    // Save the data to a file
    const sanitizedSiteName = siteData.siteName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${sanitizedSiteName}_data.json`;
    const filePath = path.join(__dirname, '../../data', fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('Data saved')
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
    console.log('lastCheckedDate updated')
}

module.exports = { scrapeData, saveLastChecked, transformEUToUN };