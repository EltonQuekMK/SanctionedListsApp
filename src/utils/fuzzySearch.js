const Fuse = require('fuse.js');

// Function to create a Fuse instance and perform fuzzy search
const fuzzySearch = (data, query) => {

    // Ensure data is an array
    if (!Array.isArray(data)) {
        throw new Error('Data should be an array of objects');
    }

    const fuse = new Fuse(data, {
        keys: [
            { name: 'FIRST_NAME', weight: 1.0 },
            { name: 'SECOND_NAME', weight: 1.0 },
            { name: 'THIRD_NAME', weight: 1.0 },
            { name: 'ALIAS.ALIAS_NAME', weight: 0.8 } // Give less weight to ALIAS.ALIAS_NAME
        ],
        threshold: 0.2, // Adjust the threshold for fuzzy matching
        includeScore: true,
    });

    return fuse.search(query);
};

const sortedFuzzySearch = (data, query) => {
    const results = fuzzySearch(data, query);
    return results.sort((a, b) => a.score - b.score); // Lower scores are better in Fuse.js
}

module.exports = { fuzzySearch, sortedFuzzySearch };