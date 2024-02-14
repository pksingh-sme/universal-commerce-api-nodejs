const bcrypt = require('bcrypt');
const authService = require('../services/authService');
const dbService = require('../services/dbService');

async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await dbService.query('SELECT * FROM users WHERE email = ?', [email]);
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

        // Send token in response
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    login,
};
