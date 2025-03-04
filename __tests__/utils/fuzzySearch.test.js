const { fuzzySearch, sortedFuzzySearch } = require('../../src/utils/fuzzySearch');

describe('fuzzySearch', () => {
    const data = [
        {
            "DATAID": "690734",
            "VERSIONNUM": "1",
            "FIRST_NAME": "YUN",
            "SECOND_NAME": "HO-JIN",
            "UN_LIST_TYPE": "DPRK",
            "REFERENCE_NUMBER": "KPi.001",
            "LISTED_ON": "2009-07-16",
            "COMMENTS1": "Director of Namchongang Trading Corporation; oversees the import of items\nneeded for the uranium enrichment program.",
            "DESIGNATION": {
                "VALUE": "Director of Namchongang Trading Corporation"
            },
            "DESIG": "true",
            "GOODQUALITY": "true",
            "NATIONALITY": {
                "VALUE": "Democratic People's Republic of Korea"
            },
            "LIST_TYPE": {
                "VALUE": "UN List"
            },
            "LAST_DAY_UPDATED": {
                "VALUE": "2022-07-26"
            },
            "INDIVIDUAL_ALIAS": {
                "QUALITY": "Good",
                "ALIAS_NAME": "Yun Ho-chin"
            },
            "INDIVIDUAL_ADDRESS": {
                "COUNTRY": "Democratic People's Republic of Korea",
                "CITY": "Pyongyang"
            },
            "INDIVIDUAL_DATE_OF_BIRTH": {
                "TYPE_OF_DATE": "EXACT",
                "DATE": "1944-10-13"
            },
            "INDIVIDUAL_PLACE_OF_BIRTH": {
                "COUNTRY": ""
            },
            "INDIVIDUAL_DOCUMENT": "",
            "SORT_KEY": "",
            "SORT_KEY_LAST_MOD": ""
        },
        {
            "DATAID": "6908045",
            "VERSIONNUM": "1",
            "FIRST_NAME": "RI",
            "SECOND_NAME": "JE-SON",
            "UN_LIST_TYPE": "DPRK",
            "REFERENCE_NUMBER": "KPi.002",
            "LISTED_ON": "2009-07-16",
            "COMMENTS1": "Former Minister of Atomic Energy Industry. Former Director of\nthe General Bureau of Atomic Energy (GBAE), chief agency directing DPRK's nuclear\nprogram; facilitated several nuclear endeavors including GBAE's management of Yongbyon\nNuclear Research Center and Namchongang Trading Corporation.",
            "DESIGNATION": {
                "VALUE": "Former Minister of Atomic Energy Industry."
            },
            "DESIG": "true",
            "GOODQUALITY": "true",
            "NATIONALITY": {
                "VALUE": "Democratic People's Republic of Korea"
            },
            "LIST_TYPE": {
                "VALUE": "UN List"
            },
            "LAST_DAY_UPDATED": {
                "VALUE": [
                    "2014-07-30",
                    "2023-06-29"
                ]
            },
            "INDIVIDUAL_ALIAS": {
                "QUALITY": "Good",
                "ALIAS_NAME": "Ri Che-son"
            },
            "INDIVIDUAL_ADDRESS": "",
            "ADDRESS": "true",
            "INDIVIDUAL_DATE_OF_BIRTH": {
                "TYPE_OF_DATE": "EXACT",
                "YEAR": "1938"
            },
            "INDIVIDUAL_PLACE_OF_BIRTH": {
                "COUNTRY": ""
            },
            "INDIVIDUAL_DOCUMENT": "",
            "SORT_KEY": "",
            "SORT_KEY_LAST_MOD": ""
        },
        {
            "DATAID": "690739",
            "VERSIONNUM": "1",
            "FIRST_NAME": "HWANG",
            "SECOND_NAME": "SOK-HWA",
            "UN_LIST_TYPE": "DPRK",
            "REFERENCE_NUMBER": "KPi.003",
            "LISTED_ON": "2009-07-16",
            "COMMENTS1": "Director in the General Bureau of Atomic Energy (GBAE); involved in\nDPRK’s nuclear program; as Chief of the Scientific Guidance Bureau in the GBAE, served\non the Science Committee inside the Joint Institute for Nuclear Research.",
            "DESIGNATION": {
                "VALUE": "Director in the General Bureau of Atomic Energy (GBAE)"
            },
            "DESIG": "true",
            "GOODQUALITY": "true",
            "NATIONALITY": {
                "VALUE": "Democratic People's Republic of Korea"
            },
            "LIST_TYPE": {
                "VALUE": "UN List"
            },
            "LAST_DAY_UPDATED": {
                "VALUE": "2023-06-29"
            },
            "INDIVIDUAL_ALIAS": {
                "QUALITY": "Good",
                "ALIAS_NAME": "HWANG SOK HA"
            },
            "INDIVIDUAL_ADDRESS": "",
            "ADDRESS": "true",
            "INDIVIDUAL_DATE_OF_BIRTH": {
                "TYPE_OF_DATE": "EXACT",
                "DATE": "1943-09-26"
            },
            "INDIVIDUAL_PLACE_OF_BIRTH": {
                "COUNTRY": ""
            },
            "INDIVIDUAL_DOCUMENT": "",
            "SORT_KEY": "",
            "SORT_KEY_LAST_MOD": ""
        }
        // Add more individuals/companies as needed
    ];

    it('should return highlighted matches for the query', () => {
        const query = 'Director';
        const results = sortedFuzzySearch(data, query);

        const expectedResults = [
            {
              item: {
                DATAID: "690739",
                VERSIONNUM: "1",
                FIRST_NAME: "HWANG",
                SECOND_NAME: "SOK-HWA",
                UN_LIST_TYPE: "DPRK",
                REFERENCE_NUMBER: "KPi.003",
                LISTED_ON: "2009-07-16",
                COMMENTS1: "Director in the General Bureau of Atomic Energy (GBAE); involved in\nDPRK’s nuclear program; as Chief of the Scientific Guidance Bureau in the GBAE, served\non the Science Committee inside the Joint Institute for Nuclear Research.",
                DESIGNATION: {
                  VALUE: "Director in the General Bureau of Atomic Energy (GBAE)",
                },
                DESIG: "true",
                GOODQUALITY: "true",
                NATIONALITY: {
                  VALUE: "Democratic People's Republic of Korea",
                },
                LIST_TYPE: {
                  VALUE: "UN List",
                },
                LAST_DAY_UPDATED: {
                  VALUE: "2023-06-29",
                },
                INDIVIDUAL_ALIAS: {
                  QUALITY: "Good",
                  ALIAS_NAME: "HWANG SOK HA",
                },
                INDIVIDUAL_ADDRESS: "",
                ADDRESS: "true",
                INDIVIDUAL_DATE_OF_BIRTH: {
                  TYPE_OF_DATE: "EXACT",
                  DATE: "1943-09-26",
                },
                INDIVIDUAL_PLACE_OF_BIRTH: {
                  COUNTRY: "",
                },
                INDIVIDUAL_DOCUMENT: "",
                SORT_KEY: "",
                SORT_KEY_LAST_MOD: "",
              },
              refIndex: 2,
              score: 0.03076096814740708,
            },
            {
              item: {
                DATAID: "690734",
                VERSIONNUM: "1",
                FIRST_NAME: "YUN",
                SECOND_NAME: "HO-JIN",
                UN_LIST_TYPE: "DPRK",
                REFERENCE_NUMBER: "KPi.001",
                LISTED_ON: "2009-07-16",
                COMMENTS1: "Director of Namchongang Trading Corporation; oversees the import of items\nneeded for the uranium enrichment program.",
                DESIGNATION: {
                  VALUE: "Director of Namchongang Trading Corporation",
                },
                DESIG: "true",
                GOODQUALITY: "true",
                NATIONALITY: {
                  VALUE: "Democratic People's Republic of Korea",
                },
                LIST_TYPE: {
                  VALUE: "UN List",
                },
                LAST_DAY_UPDATED: {
                  VALUE: "2022-07-26",
                },
                INDIVIDUAL_ALIAS: {
                  QUALITY: "Good",
                  ALIAS_NAME: "Yun Ho-chin",
                },
                INDIVIDUAL_ADDRESS: {
                  COUNTRY: "Democratic People's Republic of Korea",
                  CITY: "Pyongyang",
                },
                INDIVIDUAL_DATE_OF_BIRTH: {
                  TYPE_OF_DATE: "EXACT",
                  DATE: "1944-10-13",
                },
                INDIVIDUAL_PLACE_OF_BIRTH: {
                  COUNTRY: "",
                },
                INDIVIDUAL_DOCUMENT: "",
                SORT_KEY: "",
                SORT_KEY_LAST_MOD: "",
              },
              refIndex: 0,
              score: 0.007673614893618188,
            },
          ]

        expect(results).toEqual(expectedResults);
    });

    it('should return no matches for a non-matching query', () => {
        const query = 'Nonexistent';
        const results = fuzzySearch(data, query);

        const expectedResults = [];

        expect(results).toEqual(expectedResults);
    });
});