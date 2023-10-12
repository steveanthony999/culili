const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/index');
const restaurantRoutes = require('./routes/restaurantRoutes');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);
app.use('/api/restaurants', restaurantRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;
