const winston = require('winston');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');

const createLogger = (filename) => {
    if (process.env.VERCEL) {
        // Use console logging for Vercel
        return {
            info: (message) => console.log(`[${path.basename(filename)}] info: ${message}`),
            error: (message) => console.error(`[${path.basename(filename)}] error: ${message}`)
        };
    } else {
        // Use winston with file rotation for other environments
        return winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.label({ label: path.basename(filename) }),
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message, label }) => {
                    return `${timestamp} [${label}] ${level}: ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console(),
                new DailyRotateFile({
                    filename: 'logs/%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d'
                })
            ]
        });
    }
};

module.exports = createLogger;