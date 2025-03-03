const { runDailyJob } = require('../../src/jobs/dailyJob');
const { scrapeCompanies } = require('../../src/utils/scraper');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

jest.mock('node-cron');
jest.mock('../../src/utils/scraper');
jest.mock('fs');
jest.mock('path');

// Mock websites.json
jest.mock('../../src/data/websites.json', () => ({
    websites: [
        'https://example.com/companies1',
        'https://example.com/companies2'
    ]
}));

describe('runDailyJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.DATA_STORAGE_PATH = './data/companies.json'; // Mock dataStoragePath
    });

    it('should schedule the job to run daily', () => {
        runDailyJob();
        expect(cron.schedule).toHaveBeenCalled();
    });

    it('should scrape companies from websites and save to file', async () => {
        const mockCompanies = ['Company A', 'Company B'];
        scrapeCompanies.mockResolvedValue(mockCompanies);
        fs.writeFileSync.mockImplementation(() => {});

        // Mock the cron.schedule function to immediately invoke the callback
        cron.schedule.mockImplementation((time, callback) => {
            callback();
        });

        runDailyJob();

        // Wait for all promises to resolve
        await new Promise(process.nextTick);

        expect(scrapeCompanies).toHaveBeenCalledTimes(2); // Called for each website
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            path.join(__dirname, process.env.DATA_STORAGE_PATH),
            JSON.stringify(mockCompanies.concat(mockCompanies), null, 2)
        );
    });
});