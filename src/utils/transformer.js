const transformEUToGeneric = (euData) => {
    return euData.export.sanctionEntity.map(entity => {
        const nationality = entity.citizenship ? entity.citizenship.map(citizen => citizen.$.countryDescription).join(', ') : "";

        return {
            TYPE: entity.subjectType.$.code === "person" ? "individual" : "entity",
            FIRST_NAME: entity.nameAlias && entity.nameAlias[0] ? entity.nameAlias[0].$.wholeName.split(' ')[0] : "",
            SECOND_NAME: entity.nameAlias && entity.nameAlias[0] ? entity.nameAlias[0].$.wholeName.split(' ').slice(1).join(' ') : "",
            THIRD_NAME: "",
            ALIAS: Array.isArray(entity.nameAlias) ? entity.nameAlias.map(alias => ({ ALIAS_NAME: alias.$.wholeName })) : [],
            ADDRESS: Array.isArray(entity.address) ? entity.address : [entity.address || {}],
            DATE_OF_BIRTH: entity.birthdate || {},
            PLACE_OF_BIRTH: entity.birthdate ? { COUNTRY: entity.birthdate.$.countryDescription || "" } : {},
            NAME_ORIGINAL_SCRIPT: "",
            TITLE: entity.nameAlias && entity.nameAlias[0] && entity.nameAlias[0].$.title ? entity.nameAlias[0].$.title.split(',').join(', ') : "",
            DESIGNATION: Array.isArray(entity.nameAlias) && entity.nameAlias[0] && entity.nameAlias[0].$.function ? entity.nameAlias[0].$.function.split(',').flat() : [entity.nameAlias && entity.nameAlias[0] && entity.nameAlias[0].$.function ? entity.nameAlias[0].$.function : ""],
            NATIONALITY: nationality,
            COMMENTS: entity.remark || ""
        };
    });
};

const transformAddress = (address) => {
    const note = address.NOTE ?? "";
    const street = address.STREET ?? "";
    const city = address.CITY ?? "";
    const country = address.COUNTRY ?? "";

    return [note, street, city, country].filter(part => part !== "").join(", ");
};

const transformUNToGeneric = (data) => {
    const simplifiedData = [];

    // Transform individuals
    if (data.CONSOLIDATED_LIST.INDIVIDUALS && data.CONSOLIDATED_LIST.INDIVIDUALS.INDIVIDUAL) {
        const individuals = Array.isArray(data.CONSOLIDATED_LIST.INDIVIDUALS.INDIVIDUAL)
            ? data.CONSOLIDATED_LIST.INDIVIDUALS.INDIVIDUAL
            : [data.CONSOLIDATED_LIST.INDIVIDUALS.INDIVIDUAL];

        individuals.forEach(individual => {
            const dateOfBirth = Array.isArray(individual.INDIVIDUAL_DATE_OF_BIRTH)
                ? individual.INDIVIDUAL_DATE_OF_BIRTH.find(dob => dob.TYPE_OF_DATE === "EXACT")?.DATE || ""
                : "";

            const placeOfBirth = Array.isArray(individual.INDIVIDUAL_PLACE_OF_BIRTH)
                ? individual.INDIVIDUAL_PLACE_OF_BIRTH[0] || {}
                : individual.INDIVIDUAL_PLACE_OF_BIRTH || {};

            const nationality = Array.isArray(individual.NATIONALITY)
                ? individual.NATIONALITY.map(n => n.VALUE).join(', ')
                : (individual.NATIONALITY && Array.isArray(individual.NATIONALITY.VALUE))
                    ? individual.NATIONALITY.VALUE.filter(value => value !== "").join(', ')
                    : (individual.NATIONALITY ? individual.NATIONALITY.VALUE : "");

            const title = Array.isArray(individual.TITLE)
                ? individual.TITLE.map(t => t.VALUE).join(', ')
                : (individual.TITLE && Array.isArray(individual.TITLE.VALUE))
                    ? individual.TITLE.VALUE.filter(value => value !== "").join(', ')
                    : (individual.TITLE ? individual.TITLE.VALUE : "");

            const address = Array.isArray(individual.INDIVIDUAL_ADDRESS)
                ? individual.INDIVIDUAL_ADDRESS.map(transformAddress).filter(add => Object.keys(add).length > 0)
                : [transformAddress(individual.INDIVIDUAL_ADDRESS || {})];

            simplifiedData.push({
                TYPE: "individual",
                FIRST_NAME: individual.FIRST_NAME || "",
                SECOND_NAME: individual.SECOND_NAME || "",
                THIRD_NAME: individual.THIRD_NAME || "",
                ALIAS: Array.isArray(individual.INDIVIDUAL_ALIAS) ? individual.INDIVIDUAL_ALIAS.map(alias => ({ ALIAS_NAME: alias.ALIAS_NAME })).filter(alias => alias.ALIAS_NAME !== "") : [],
                ADDRESS: address,
                DATE_OF_BIRTH: dateOfBirth,
                PLACE_OF_BIRTH: placeOfBirth,
                NAME_ORIGINAL_SCRIPT: individual.NAME_ORIGINAL_SCRIPT || "",
                TITLE: title,
                DESIGNATION: Array.isArray(individual.DESIGNATION) ? individual.DESIGNATION.flatMap(d => d.VALUE).filter(value => value !== "") : (individual.DESIGNATION && Array.isArray(individual.DESIGNATION.VALUE) ? individual.DESIGNATION.VALUE.filter(value => value !== "") : [individual.DESIGNATION ? individual.DESIGNATION.VALUE : ""]),
                NATIONALITY: nationality,
                COMMENTS: individual.COMMENTS1 || ""
            });
        });
    }

    // Transform entities
    if (data.CONSOLIDATED_LIST.ENTITIES && data.CONSOLIDATED_LIST.ENTITIES.ENTITY) {
        const entities = Array.isArray(data.CONSOLIDATED_LIST.ENTITIES.ENTITY)
            ? data.CONSOLIDATED_LIST.ENTITIES.ENTITY
            : [data.CONSOLIDATED_LIST.ENTITIES.ENTITY];

        entities.forEach(entity => {
            const dateOfBirth = Array.isArray(entity.ENTITY_DATE_OF_BIRTH)
                ? entity.ENTITY_DATE_OF_BIRTH.find(dob => dob.TYPE_OF_DATE === "EXACT")?.DATE || ""
                : "";

            const placeOfBirth = Array.isArray(entity.ENTITY_PLACE_OF_BIRTH)
                ? entity.ENTITY_PLACE_OF_BIRTH[0] || {}
                : entity.ENTITY_PLACE_OF_BIRTH || {};

            const nationality = Array.isArray(entity.NATIONALITY)
                ? entity.NATIONALITY.map(n => n.VALUE).join(', ')
                : (entity.NATIONALITY && Array.isArray(entity.NATIONALITY.VALUE))
                    ? entity.NATIONALITY.VALUE.filter(value => value !== "").join(', ')
                    : (entity.NATIONALITY ? entity.NATIONALITY.VALUE : "");

            const title = Array.isArray(entity.TITLE)
                ? entity.TITLE.map(t => t.VALUE).join(', ')
                : (entity.TITLE && Array.isArray(entity.TITLE.VALUE))
                    ? entity.TITLE.VALUE.filter(value => value !== "").join(', ')
                    : (entity.TITLE ? entity.TITLE.VALUE : "");

            const address = Array.isArray(entity.ENTITY_ADDRESS)
                ? entity.ENTITY_ADDRESS.map(transformAddress).filter(add => Object.keys(add).length > 0)
                : [transformAddress(entity.ENTITY_ADDRESS || {})];

            simplifiedData.push({
                TYPE: "entity",
                FIRST_NAME: entity.FIRST_NAME || "",
                SECOND_NAME: entity.SECOND_NAME || "",
                THIRD_NAME: entity.THIRD_NAME || "",
                ALIAS: Array.isArray(entity.ENTITY_ALIAS) ? entity.ENTITY_ALIAS.map(alias => ({ ALIAS_NAME: alias.ALIAS_NAME })).filter(alias => alias.ALIAS_NAME !== "") : [],
                ADDRESS: address,
                DATE_OF_BIRTH: dateOfBirth,
                PLACE_OF_BIRTH: placeOfBirth,
                NAME_ORIGINAL_SCRIPT: entity.NAME_ORIGINAL_SCRIPT || "",
                TITLE: title,
                DESIGNATION: Array.isArray(entity.DESIGNATION) ? entity.DESIGNATION.flatMap(d => d.VALUE).filter(value => value !== "") : (entity.DESIGNATION && Array.isArray(entity.DESIGNATION.VALUE) ? entity.DESIGNATION.VALUE.filter(value => value !== "") : [entity.DESIGNATION ? entity.DESIGNATION.VALUE : ""]),
                NATIONALITY: nationality,
                COMMENTS: entity.COMMENTS1 || ""
            });
        });
    }

    return simplifiedData;
};

const notRequired = (data) => {
    return data;
}

// Transform Strategy
const transformers = {
    'notRequired': notRequired,
    'transformUNToGeneric': transformUNToGeneric,
    'transformEUToGeneric': transformEUToGeneric
};

module.exports = { transformers };
