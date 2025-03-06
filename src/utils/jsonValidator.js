const fs = require('fs');
const path = require('path');
const { Validator } = require('jsonschema');

// Utility function to validate JSON data against a schema
const validateJson = (data, schemaPath) => {
    // Load the JSON schema
    const schemaPath = path.join(__dirname, '../../data/jsonschema.json');
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    // Validate the JSON data
    const validator = new Validator();
    const validationResult = validator.validate(data, schema);

    if (validationResult.errors.length > 0) {
        console.error('Validation errors:', validationResult.errors.length);
        return false;
    } else {
        console.log('JSON data is valid.');
        return true;
    }
};

module.exports = { validateJson };