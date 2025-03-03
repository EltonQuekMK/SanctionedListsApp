const { scrapeCompanies } = require('./src/utils/scraper');

const run = async () => {
    try {
        const realUrl = 'https://scsanctions.un.org/xml/en/dprk';
        const result = await scrapeCompanies(realUrl);
        console.log('Scraped companies:', result);
    } catch (error) {
        console.error('Error:', error);
    }
};

run();