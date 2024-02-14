const dbService = require('../services/dbService');

class User {
    constructor(firstname, email, password) {
        this.firstname = firstname;
        this.email = email;
        this.password = password;
    }

    async save() {
        try {
            const query = 'INSERT INTO users (first_name, email, password_hash) VALUES (?, ?, ?)';
            const values = [this.firstname, this.email, this.password];
            await dbService.query(query, values);
            return true; // Return true if user is successfully saved
        } catch (error) {
            console.error('Error saving user:', error);
            return false; // Return false if there's an error
        }
    }

    static async updateProfile(userId, phone, firstName, lastName) {
        try {
            await dbService.query('UPDATE users SET phone = ?, first_name = ?, last_name = ? WHERE user_id = ?', [phone, firstName, lastName, userId]);
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error('Failed to update user profile');
        }
    }

    static async updateProfilePic(userId, profilePic) {
        try {
            await dbService.query('UPDATE users SET photo = ? WHERE user_id = ?', [profilePic, userId]);
        } catch (error) {
            console.error('Error updating user profile picture:', error);
            throw new Error('Failed to update user profile picture');
        }
    }
}

module.exports = User;