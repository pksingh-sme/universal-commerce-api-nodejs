/*
 * Model Name: User
 * Filename: User.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: 
 *  Model for manage user in the application. 
 *  It contains methods to interact with the database regarding application users.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const dbService = require('../services/dbService');

class User {

    /**
     * Constructs a new User object.
     * @param {string} firstname - The first name of the user.
     * @param {string} email - The email address of the user.
     * @param {string} password - The hashed password of the user.
     * @param {string} phone - The phone of the user.
     */
    constructor(firstname, email, password, phone) {
        this.firstname = firstname;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }

    /**
     * Saves the user to the database.
     * @returns {boolean} - True if the user is successfully saved, false otherwise.
     */    
    async save() {
        try {
            const query = 'INSERT INTO Users (first_name, email, password_hash, phone) VALUES (?, ?, ?, ?)';
            const values = [this.firstname, this.email, this.password, this.phone];
            const result = await dbService.query(query, values);
            return result.insertId; // Return true if user is successfully saved
        } catch (error) {
            console.error('Error saving user:', error);
            return false; // Return false if there's an error
        }
    }

    /**
     * Updates the profile information of a user.
     * @param {number} userId - The ID of the user whose profile to update.
     * @param {string} phone - The phone number to update.
     * @param {string} firstName - The first name to update.
     * @param {string} lastName - The last name to update.
     * @throws {Error} - Throws an error if the profile update fails.
     */    
    static async updateProfile(userId, phone, firstName, lastName) {
        try {
            await dbService.query('UPDATE Users SET phone = ?, first_name = ?, last_name = ? WHERE user_id = ?', [phone, firstName, lastName, userId]);
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error('Failed to update user profile');
        }
    }

    /**
     * Updates the profile picture of a user.
     * @param {number} userId - The ID of the user whose profile picture to update.
     * @param {string} profilePic - The URL of the new profile picture.
     * @throws {Error} - Throws an error if the profile picture update fails.
     */    
    static async updateProfilePic(userId, profilePic) {
        try {
            await dbService.query('UPDATE Users SET photo = ? WHERE user_id = ?', [profilePic, userId]);
        } catch (error) {
            console.error('Error updating user profile picture:', error);
            throw new Error('Failed to update user profile picture');
        }
    }


    
    /**
     * Updates user's password in the database
     * @param {number} userId - The ID of the user whose profile picture to update.
     * @param {string} hashedPassword - new hasked password
     * @throws {Error} - Throws an error if the password update fails.
     */  
    static async updatePassword(userId, hashedPassword) {
        try {
            await dbService.query('UPDATE Users SET password_hash = ? WHERE user_id = ?', [hashedPassword, userId]);
        } catch (error) {
            console.error('Error updating user password:', error);
            throw new Error('Failed to reset password');
        }
    }

}

module.exports = User;