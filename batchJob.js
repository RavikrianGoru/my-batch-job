const cron = require('node-cron');
const winston = require('winston');



const xlsx = require('xlsx');
const path = require('path');
// Function to read Excel file and retrieve data based on matched value in a specific column
const readExcelAndRetrieveData = (filePath, columnName, matchValue) => {
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);

    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];

    // Get the worksheet
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    console.log('Json Data:', jsonData);

    // Find the rows that match the specified value in the specified column
    const matchedRows = jsonData.filter(row => row[columnName] === matchValue);

    return matchedRows;
};

// Example usage
const filePath = path.join(__dirname, 'example.xlsx'); // Replace with your Excel file path
const columnName = 'Status'; // Replace with your column name
const matchValue = 'Active'; // Replace with the value you want to match

const statusMatchedData = readExcelAndRetrieveData(filePath, columnName, matchValue);
console.log('Status Matched Data:', statusMatchedData);


const columnName2 = 'Name'; // Replace with your column name
const matchValue2 = 'Bob'; // Replace with the value you want to match

const nameMatchedData = readExcelAndRetrieveData(filePath, columnName2, matchValue2);
console.log('Status Matched Data:', nameMatchedData);

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


// Schedule the batch job to run every 10 seconds
cron.schedule('0 0 * * * *', () => {
    logger.info('Batch job started.');
    runBatchJob();
});

// to run now
logger.info(`Batch job started  now on env key ${apiKey}. `);
runBatchJob();
logger.info(`Batch job scheduler started on env key ${apiKey}. Waiting for the next run...`);
