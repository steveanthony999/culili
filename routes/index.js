// Import necessary modules
const express = require('express'); // Express framework
const router = express.Router(); // Create a new router instance

// Import custom error class for more specific error handling
const CustomError = require('../utils/CustomError');

// Route to intentionally trigger a custom error for testing purposes
router.get('/error-test', (req, res, next) => {
  // Throw a custom error with a 404 status code and a custom message
  throw new CustomError(404, 'Intentional Test Error');
});

// Route to intentionally trigger an unhandled error for testing purposes
router.get('/unhandled-error-test', (req, res) => {
  // Throw a generic error without a specific message or status code
  throw new Error();
});

// Export the router to be used in the main server file
module.exports = router;
