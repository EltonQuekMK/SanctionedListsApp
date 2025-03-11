const fs = require('fs');
const path = require('path');
const { sortedFuzzySearch } = require('./src/utils/fuzzySearch.js');

const search = (query) => {
    const dataPath = path.join(__dirname, 'data', 'UN_United_Nations_Security_Council_Consolidated_List_data.json');
    const rawData = fs.readFileSync(dataPath);
    const data = JSON.parse(rawData);

    const results = sortedFuzzySearch(data, query);

    // Save results to a file
    const resultsPath = path.join(__dirname, 'data', 'search_results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

    console.log(`Search results saved to ${resultsPath}`);
};

// Example usage
search('Wali Mohammad');