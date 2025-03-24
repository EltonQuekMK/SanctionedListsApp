const fs = require('fs');
const path = require('path');
const { Validator } = require('jsonschema');
const createLogger = require('./logger');

const logger = createLogger(__filename);

// Utility function to validate JSON data against a schema
const validateJson = (data) => {
    // Load the JSON schema
    const schemaPath = path.join(__dirname, '../../data/jsonschema.json');
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    // Validate the JSON data
    const validator = new Validator();
    const validationResult = validator.validate(data, schema);

    if (validationResult.errors.length > 0) {
        logger.error('Validation errors:', validationResult.errors.length);
        return false;
    } else {
        logger.info('JSON data is valid.');
        return true;
    }
};

module.exports = { validateJson };