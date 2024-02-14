const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authService = require('../services/authService');

// POST route for user registration
router.post('/register', userController.registerUser);

// PUT route to update user's phone number, first name, and last name
router.post('/update-profile', authService.authenticate, userController.updateProfile);

// POST route to update user's profile picture
router.post('/update-profile-pic', userController.updateProfilePic);

module.exports = router;
