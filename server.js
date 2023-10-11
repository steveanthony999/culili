// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/index');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Use the main routes from the routes directory
app.use('/', routes);

// Middlewares

// Global error handling middleware
// This middleware catches all errors thrown in the application
// and sends a response with the error message and status code.
// If the error does not have a status code, it defaults to 500 (Internal Server Error).
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
});

// Export the app instance for use in other files (e.g., start.js, tests)
module.exports = app;
