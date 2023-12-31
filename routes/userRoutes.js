const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

router.post('/register', userController.register);

router.post('/verify-email', userController.sendVerificationEmail);

router.get('/verify-email', userController.verifyEmail);

router.post('/login', userController.login);

router.get('/currentuser', protect, userController.getCurrentUser);

// router.get('/logout', userController.logout);

module.exports = router;
