const express = require('express');
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/logout', isAuthenticated, authController.logout);

module.exports = router;
