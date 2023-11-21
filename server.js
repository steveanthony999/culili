const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

// const corsOptions = {
//   origin: 'https://app.culili.com',
//   optionsSuccessStatus: 200,
//   credentials: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// };

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// TODO:  Cleanup Routes
app.use('/', routes);
app.use('/api/users', userRoutes);
app.use('/api/projects', require('./routes/projectsRoutes'));
app.use('/projects', express.static(path.join(__dirname, './utils/user_projects')));
// DELETE
app.use('/api/restaurants', restaurantRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;
