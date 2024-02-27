/*
 * Filename: authRoutes.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Description: Routes for user authentication (e.g., login)
 * Version: 1.0
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to handle user login
router.post('/login', authController.login);

module.exports = router;
