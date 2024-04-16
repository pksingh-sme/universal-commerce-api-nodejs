/*
 * Filename: authService.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Version: 1.0
 */

const jwt = require('jsonwebtoken');
const config = require('../../config/config');

function generateToken(user) {
    return jwt.sign({ user_id: user.user_id }, config.jwtSecret, { expiresIn: '1h' });
}

function generateRefreshToken(user) {
    return jwt.sign({ user_id: user.user_id }, config.refreshTokenSecret);
}

function authenticate(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.user_id;
        next();
    });
}

module.exports = {
    generateToken,
    generateRefreshToken,
    authenticate,
};
