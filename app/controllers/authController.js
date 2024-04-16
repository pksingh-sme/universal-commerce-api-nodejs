/*
 * Controller Name: AuthController
 * Filename: authController.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: Controller for authentication, handling logic for user login, registration, and authentication token management.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const authService = require('../services/authService');
const dbService = require('../services/dbService');
//const session = require('express-session');


async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await dbService.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (!user.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user[0].password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = authService.generateToken(user[0]);

        // Generate refresh token
        const refreshToken = authService.generateRefreshToken(user[0]);

        // Save refresh token in the database
        await dbService.query('UPDATE Users SET token = ? WHERE email = ?', [refreshToken, email]);

        // Set session data for user id
        //req.session.userId = user[0].user_id;

        // Send token and user info in response
        res.status(200).json({ token, refreshToken, user: {
            userId: user[0].user_id,
            email: user[0].email,
            firstName: user[0].first_name,
            lastName: user[0].last_name,
            phone: user[0].phone,
            photo: user[0].photo,
            type: user[0].type
        }});
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function refreshToken(req, res) {
    const { refreshToken } = req.body;

    try {
        const decoded = jwt.verify(refreshToken, config.refreshTokenSecret);

        const user = await dbService.query('SELECT * FROM Users WHERE user_id = ?', [decoded.user_id]);
        if (!user.length || user[0].token !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const token = authService.generateToken(user[0]);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    login,
    refreshToken
};
