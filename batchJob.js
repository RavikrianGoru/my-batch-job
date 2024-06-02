const cron = require('node-cron');
const winston = require('winston');
require('dotenv').config();

// Now you can access environment variables using process.env
const apiKey = process.env.API_KEY;

// Setup logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'batchJob.log' })
    ]
});


// Define the task you want to run as a batch job
const runBatchJob = async () => {
    try {
        logger.info('Running batch job...');
        // Place your batch job logic here
        // For example, processing files, making API requests, etc.
        logger.info('Batch job completed successfully.');
    } catch (error) {
        logger.error('Batch job failed:', error);
    }
};

// Schedule the batch job to run every day at midnight
cron.schedule('0 0 * * *', () => {
    logger.info('Batch job started.');
    runBatchJob();
});

logger.info(`Batch job scheduler started on env key ${apiKey}. Waiting for the next run...`);
