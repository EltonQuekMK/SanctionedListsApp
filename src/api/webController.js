const fs = require('fs');
const path = require('path');
const { sortedFuzzySearch } = require('../utils/fuzzySearch.js');

const search = (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const dataPath = path.join(__dirname, '../../data/UN_United_Nations_Security_Council_Consolidated_List_data.json');
    const rawData = fs.readFileSync(dataPath);
    const data = JSON.parse(rawData);

    const results = sortedFuzzySearch(data, query);

    // Save results to a file
    const resultsPath = path.join(__dirname, '../../data/search_results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

    res.json({ results, message: `Search results saved to ${resultsPath}` });
};

const initialize = (app) => {
    app.post('/search', search);
};

module.exports = { search, initialize };