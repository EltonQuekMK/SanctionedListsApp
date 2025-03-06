const fs = require('fs');
const path = require('path');
const { transformEUToUN } = require('./src/utils/scraper');

// Load the EU JSON data
const euDataPath = path.join(__dirname, 'data/2025-03-04_EU___Consolidated_list_of_persons_subject__under_EU_sanctions__to_travel_restrictions_data.json');
const euData = JSON.parse(fs.readFileSync(euDataPath, 'utf8'));

// Transform the EU data to UN format
const unData = transformEUToUN(euData);

// // Save the transformed data to a file
// const outputFilePath = path.join(__dirname, 'data/transformed_UN_list.json');
// fs.writeFileSync(outputFilePath, JSON.stringify({ CONSOLIDATED_LIST: { INDIVIDUALS: { INDIVIDUAL: unData } } }, null, 2));

// console.log('Transformation complete. Transformed data saved to', outputFilePath);