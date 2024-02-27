/*
 * Model Name: Cart
 * Filename: Cart.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: 
 *  Model for manage user's Cart in the application. 
 *  It contains methods to interact with the database regarding user carts.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const dbService = require('../services/dbService');

class Cart {

    /**
     * Creates an instance of Cart.
     * @param {number} userId - The ID of the user associated with the cart.
     * @param {number} projectId - The ID of the project associated with the cart item.
     * @param {number} quantity - The quantity of the project added to the cart.
     */
    constructor(userId, projectId, quantity) {
        this.userId = userId;
        this.projectId = projectId;
        this.quantity = quantity;
    }
    
    /**
     * Adds a project to the user's cart.
     * @returns {boolean} - True if the project is successfully added to the cart, false otherwise.
     */
    async addToCart() {
        try {
            const query = 'INSERT INTO Cart (user_id, project_id, quantity) VALUES (?, ?, ?)';
            const values = [this.userId, this.projectId, this.quantity];
            await dbService.query(query, values);
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return false;
        }
    }

    /**
     * Updates the quantity of a project in the user's cart.
     * @param {number} quantity - The new quantity of the project in the cart.
     * @returns {boolean} - True if the cart item is successfully updated, false otherwise.
     */
    async updateCartItem(quantity) {
        try {
            const query = 'UPDATE Cart SET quantity = ? WHERE user_id = ? AND project_id = ?';
            const values = [quantity, this.userId, this.projectId];
            await dbService.query(query, values);
            return true;
        } catch (error) {
            console.error('Error updating cart item:', error);
            return false;
        }
    }

    /**
     * Deletes a project from the user's cart.
     * @returns {boolean} - True if the cart item is successfully deleted, false otherwise.
     */
    async deleteCartItem() {
        try {
            const query = 'DELETE FROM Cart WHERE user_id = ? AND project_id = ?';
            const values = [this.userId, this.projectId];
            await dbService.query(query, values);
            return true;
        } catch (error) {
            console.error('Error deleting cart item:', error);
            return false;
        }
    }

    /**
     * Finds the user's cart items by user ID.
     * @param {number} userId - The ID of the user.
     * @returns {Array} - An array of cart items belonging to the specified user.
     * @throws {Error} - If there's an error fetching cart items.
     */
    static async findByUserId(userId) {
        try {
            const result = await dbService.query('SELECT * FROM Cart WHERE user_id = ?', [userId]);
            return result; // Returns the cart found
        } catch (error) {
            console.error('Error fetching cart by user ID:', error);
            throw new Error('Failed to fetch cart');
        }
    }

    // Implement other methods as needed
}

module.exports = Cart;
