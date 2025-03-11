const fs = require('fs');
const path = require('path');
const { Validator } = require('jsonschema');

// Load the JSON schema
const schemaPath = path.join(__dirname, 'data/jsonschema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// Load the JSON data
const dataPath = path.join(__dirname, 'data/UN_1718_Democratic_People_s_Republic_of_Korea_data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Validate the JSON data
const validator = new Validator();
const validationResult = validator.validate(data, schema);

if (validationResult.errors.length > 0) {
    console.error('Validation errors:', validationResult.errors);
} else {
    console.log('JSON data is valid.');
}