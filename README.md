# Node Server Project

This project is a Node.js application that sets up a server using Express and includes a scheduled job that runs daily to scrape a list of companies from a specified website. The extracted data is stored locally.

## Project Structure

```
node-server-project
├── src
│   ├── server.js          # Entry point of the Node.js server
│   ├── jobs
│   │   └── dailyJob.js    # Daily job scheduler
│   └── utils
│       └── scraper.js     # Web scraping utility
├── package.json           # npm configuration file
├── .env                   # Environment variables
└── README.md              # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd node-server-project
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the necessary variables, such as the target URL for scraping.

4. **Run the server:**
   ```
   npm start
   ```

## Usage

The server will start and the daily job will be scheduled to run at a specified time each day. The job will scrape the list of companies from the target website and store the data locally.

## Daily Job

The daily job is defined in `src/jobs/dailyJob.js` and utilizes the `scraper.js` utility to perform the web scraping. The job is scheduled using the `node-cron` library.

## Scraping Functionality

The scraping logic is implemented in `src/utils/scraper.js`, which uses `Axios` for making HTTP requests and `Cheerio` for parsing the HTML content to extract company information.

## License

This project is licensed under the MIT License.