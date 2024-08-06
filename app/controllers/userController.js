/*
 * Controller Name: UserController
 * Filename: userController.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: Controller for managing user's profile in application .
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const bcrypt = require('bcrypt');
const User = require('../models/User');
const dbService = require('../services/dbService');
const emailService = require('../services/emailService');
const path = require('path');

/**
 * Registers a new user.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route POST /api/users/register
 * @access Public
 * @description Register a new user.
 */
async function registerUser(req, res) {

    const { firstname, email, password, phone } = req.body;

    try {
        // Check if the user already exists in the database
        const existingUser = await dbService.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const user = new User(firstname, email, hashedPassword, phone);

        // Save the user to the database
        const userId = await user.save();

        if (userId > 0) {
            const recipientEmail = `pksingh.sme@gmail.com,rajukhinda@gmail.com`; // Replace with the recipient's email address
            const subject = 'Welcome to PrimePix'; // Replace with the email subject
            const templatePath = path.join(__dirname, '../templates/emails/registration.html'); // Path to the email template
            const data = {
                firstName: firstname
            };
    
            emailService.sendEmail(recipientEmail, subject, templatePath, data);        
            
            res.status(201).json({ message: 'User registered successfully' });
        } else {
            res.status(500).json({ message: 'Failed to register user' });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Updates the profile of a user.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route PUT /api/users/profile
 * @access Private
 * @description Update the profile of a user.
 */
async function updateProfile(req, res) {
    const { userId, phone, firstName, lastName } = req.body;

    try {
        await User.updateProfile(userId, phone, firstName, lastName);
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Updates the profile picture of a user.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route PUT /api/users/profile-pic
 * @access Private
 * @description Update the profile picture of a user.
 */
async function updateProfilePic(req, res) {
    const { userId, profilePic } = req.body;

    try {
        await User.updateProfilePic(userId, profilePic);
        res.status(200).json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Function to generate a random password
function generateRandomPassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>?";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
}


/**
 * Updates the profile picture of a user.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route PUT /api/users/reset-password
 * @access Private
 * @description Update the profile picture of a user.
 */
async function resetPassword(req, res) {
    const { email } = req.body;

    try {
        const newPassword = generateRandomPassword();

        const existingUser = await dbService.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length) {
            
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.updatePassword(existingUser[0].user_id, hashedPassword);

            const recipientEmail = `pksingh.sme@gmail.com,rajukhinda@gmail.com`; // Replace with the recipient's email address
            const subject = 'Your New Password';
            const templatePath = path.join(__dirname, '../templates/emails/resetPassword.html');
            const data = {
                firstName: existingUser[0].first_name, // Fetch from DB or pass as a parameter
                newPassword
            };
        
            await emailService.sendEmail(recipientEmail, subject, templatePath, data);

            return res.status(200).json({ message: 'Password reset email sent.' });
        }else{
            return res.status(400).json({ message: 'email does not exists' });
        }

  
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    registerUser,
    updateProfile,
    resetPassword,
    updateProfilePic,
};
