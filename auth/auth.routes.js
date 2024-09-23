const express = require('express');
const router = express.Router();
const authController = require('./auth.controller'); // Ensure this path is correct

// Define your routes
router.post('/login', authController.login); // Ensure `login` is defined
router.post('/logout', authController.logout); // Ensure `logout` is defined

module.exports = router;
