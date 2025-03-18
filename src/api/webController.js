const fs = require('fs');
const path = require('path');
const { fuzzySearch } = require('../utils/fuzzySearch.js');

const search = (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    // for each website in websites.json
    // get the data from the fileName associated with the website
    // perform a fuzzy search on the data
    // return the results with the where the requirement are from (requirementFrom)
    const websitesPath = path.join(__dirname, '../../data/websites.json');
    const rawData = fs.readFileSync(websitesPath);
    const websites = JSON.parse(rawData);

    const results = [];

    for (const site of websites) {
        const dataPath = path.join(__dirname, '../../data', site.fileName);
        const rawData = fs.readFileSync(dataPath);
        const data = JSON.parse(rawData);

        const siteResults = fuzzySearch(data, query);
        siteResults.forEach(result => {
            result.requirementFrom = site.requirementFrom;
            result.siteName = site.siteName;
            result.url = site.url;
        });
        results.push(...siteResults);
    }

    results.sort((a, b) => b.score - a.score);

    // Save results to a file (for testing)
    // const resultsPath = path.join(__dirname, '../../data/search_results.json');
    // fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

    res.json({ results });
};

const initialize = (app) => {
    app.post('/search', search);
};

module.exports = { search, initialize };