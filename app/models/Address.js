/*
 * Model Name: Address
 * Filename: Address.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: 
 *  Model for manage user's Address in the application. 
 *  It contains methods to interact with the database regarding user addresses.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const dbService = require('../services/dbService');

class Address {
    
    /**
     * Creates an instance of Address.
     * @param {number} userId - The ID of the user associated with the address.
     * @param {string} type - The type of address (e.g., 'shipping', 'billing').
     * @param {string} firstName - The first name of the recipient.
     * @param {string} lastName - The last name of the recipient.
     * @param {string} streetAddress1 - The first line of the street address.
     * @param {string} city - The city of the address.
     * @param {string} state - The state or region of the address.
     * @param {string} zip - The ZIP or postal code of the address.
     * @param {string} country - The country of the address.
     * @param {string} [phone=''] - The phone number associated with the address.
     * @param {string} [email=''] - The email address associated with the address.
     * @param {string} [companyName=''] - The name of the company associated with the address.
     * @param {string} [streetAddress2=''] - The second line of the street address (if applicable).
     */    
    constructor(userId, type, firstName, lastName, streetAddress1, city, state, zip, country, phone = '', email = '', companyName = '', streetAddress2 = '') {
        this.userId = userId;
        this.type = type;
        this.firstName = firstName;
        this.lastName = lastName;
        this.streetAddress1 = streetAddress1;
        this.streetAddress2 = streetAddress2;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.country = country;
        this.phone = phone;
        this.email = email;
        this.companyName = companyName;
    }

    /**
     * Saves the address to the database.
     * @returns {boolean} - True if the address is successfully saved, false otherwise.
     */
    async save() {
        try {
            const query = 'INSERT INTO Addresses (user_id, type, first_name, last_name, company_name, street_address1, street_address2, city, state, zip, country, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [this.userId, this.type, this.firstName, this.lastName, this.companyName, this.streetAddress1, this.streetAddress2, this.city, this.state, this.zip, this.country, this.phone, this.email];
            const result = await dbService.query(query, values);
            return result.insertId; // Return true if address is successfully saved
        } catch (error) {
            console.error('Error saving address:', error);
            return false; // Return false if there's an error
        }
    }

    /**
     * Finds addresses by user ID.
     * @param {number} userId - The ID of the user.
     * @returns {Array} - An array of addresses belonging to the specified user.
     * @throws {Error} - If there's an error fetching addresses.
     */    
    static async findByUserId(userId) {
        try {
            const result = await dbService.query('SELECT * FROM Addresses WHERE user_id = ?', [userId]);
            return result; // Returns the address(es) found
        } catch (error) {
            console.error('Error fetching addresses by user ID:', error);
            throw new Error('Failed to fetch addresses');
        }
    }

    /**
     * Finds an address by its ID.
     * @param {number} addressId - The ID of the address.
     * @returns {Object} - The address object.
     * @throws {Error} - If there's an error fetching the address.
     */    
    static async findByAddressId(addressId) {
        try {
            const result = await dbService.query('SELECT * FROM Addresses WHERE address_id = ?', [addressId]);
            return result; // Returns the address(es) found
        } catch (error) {
            console.error('Error fetching addresses by user ID:', error);
            throw new Error('Failed to fetch addresses');
        }
    }

    /**
     * Updates an address.
     * @param {number} addressId - The ID of the address to update.
     * @param {Object} updateFields - An object containing the fields to update.
     * @returns {void}
     * @throws {Error} - If there's an error updating the address.
     */    
    static async updateAddress(addressId, updateFields) {
        try {
            const setClause = Object.keys(updateFields).map((key) => `${key} = ?`).join(', ');
            const values = [...Object.values(updateFields), addressId];
            await dbService.query(`UPDATE Addresses SET ${setClause} WHERE address_id = ?`, values);
        } catch (error) {
            console.error('Error updating address:', error);
            throw new Error('Failed to update address');
        }
    }

    /**
     * Deletes an address by its ID.
     * @param {number} addressId - The ID of the address to delete.
     * @returns {void}
     * @throws {Error} - If there's an error deleting the address.
     */
    static async deleteById(addressId) {
        try {
            await dbService.query('DELETE FROM Addresses WHERE address_id = ?', [addressId]);
        } catch (error) {
            console.error('Error deleting address:', error);
            throw new Error('Failed to delete address');
        }
    }
}

module.exports = Address;
