// Import necessary modules
const express = require('express'); // Express framework
const router = express.Router(); // Create a new router instance

// Import custom error class for more specific error handling
// const CustomError = require('../utils/CustomError');

router.get('/', (req, res) =>
  res.status(200).json({ message: 'Hello Culili' })
);

// Export the router to be used in the main server file
module.exports = router;
