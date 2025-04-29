/*
 * Controller Name: AuthController
 * Filename: authController.js
 * Author: Pramod K Singh
 * Date: April 2025
 * Description: Controller for authentication, including email/password and Google login.
 * Version: 1.2
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const authService = require('../services/authService');
const dbService = require('../services/dbService');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(config.googleClientId);

// ---------- Email/Password Login ----------
async function login(req, res) {
    const { email, password } = req.body;

    try {
        const userResults = await dbService.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (!userResults.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResults[0];

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = authService.generateToken(user);
        const refreshToken = authService.generateRefreshToken(user);

        await dbService.query('UPDATE Users SET token = ? WHERE email = ?', [refreshToken, email]);

        res.status(200).json({
            token,
            refreshToken,
            user: buildUserResponse(user)
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// ---------- Google Login ----------
async function googleLogin(req, res) {
    const { idToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: config.googleClientId,
        });

        const payload = ticket.getPayload();
        const { email, email_verified, sub, given_name, family_name, picture } = payload;

        if (!email_verified) {
            return res.status(400).json({ message: 'Email not verified by Google.' });
        }

        let userResults = await dbService.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (!userResults.length) {
            await dbService.query(`
                INSERT INTO Users (email, first_name, last_name, photo, social_id, email_verified, provider, type, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [email, given_name, family_name, picture, sub, true, 'google', 'Email']);
            
            userResults = await dbService.query('SELECT * FROM Users WHERE email = ?', [email]);
        }

        const user = userResults[0];

        if (!user.user_id) {
            return res.status(500).json({ message: 'User ID missing in database' });
        }

        const token = authService.generateToken(user);
        const refreshToken = authService.generateRefreshToken(user);

        await dbService.query('UPDATE Users SET token = ? WHERE user_id = ?', [refreshToken, user.user_id]);

        res.status(200).json({
            token,
            refreshToken,
            user: buildUserResponse(user)
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// ---------- Refresh Token ----------
async function refreshToken(req, res) {
    const { refreshToken } = req.body;

    try {
        const decoded = jwt.verify(refreshToken, config.refreshTokenSecret);

        if (!decoded.user_id) {
            return res.status(403).json({ message: 'Invalid token payload' });
        }

        const userResults = await dbService.query('SELECT * FROM Users WHERE user_id = ?', [decoded.user_id]);

        if (!userResults.length || userResults[0].token !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newToken = authService.generateToken(userResults[0]);

        res.status(200).json({ token: newToken });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// ---------- Helper to build response ----------
function buildUserResponse(user) {
    return {
        userId: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        photo: user.photo,
        type: user.type,
        provider: user.provider
    };
}

module.exports = {
    login,
    refreshToken,
    googleLogin
};
