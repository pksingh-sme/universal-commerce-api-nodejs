const bcrypt = require('bcrypt');
const User = require('../models/User');
const dbService = require('../services/dbService');

async function registerUser(req, res) {

    const { firstname, email, password } = req.body;

    try {
        // Check if the user already exists in the database
        const existingUser = await dbService.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const user = new User(firstname, email, hashedPassword);

        // Save the user to the database
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


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

module.exports = {
    registerUser,
    updateProfile,
    updateProfilePic,
};
