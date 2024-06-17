/*
 * Filename: userRoutes.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Description: Routes for managing user profiles
 * Version: 1.0
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authService = require('../services/authService');

// POST route for user registration
router.post('/register', userController.registerUser);

// PUT route to update user's phone number, first name, and last name
router.post('/update-profile', authService.authenticate, userController.updateProfile);

// PUT route to auto generate new user's password
router.post('/reset-password',  userController.resetPassword);

// POST route to update user's profile picture
router.post('/update-profile-pic', userController.updateProfilePic);



module.exports = router;
