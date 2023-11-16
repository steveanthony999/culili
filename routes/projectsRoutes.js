const express = require('express');
const router = express.Router();
const { createProject } = require('../controllers/projectsController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createProject);

module.exports = router;
