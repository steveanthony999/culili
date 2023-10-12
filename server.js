const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/index');
const restaurantRoutes = require('./routes/restaurantRoutes');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

connectDB();

// Initialize the Express application
const app = express();

// const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', routes);
app.use('/api/restaurants', restaurantRoutes);

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

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Export the app instance for use in other files (e.g., start.js, tests)
module.exports = app;
