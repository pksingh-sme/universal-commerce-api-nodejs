/*
 * Model Name: Order
 * Filename: Order.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: 
 *  Model for manage user's Order in the application. 
 *  It contains methods to interact with the database regarding user orders.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const dbService = require('../services/dbService');

class Order {
    constructor(userId, totalAmount, status, paymentStatus, shippingAddressId, billingAddressId, orderDetails, cartData) {
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.paymentStatus = paymentStatus; 
        this.shippingAddressId = shippingAddressId;
        this.billingAddressId = billingAddressId;
        this.orderDetails = orderDetails;
        this.cartData = cartData;
    }

    /**
 * Create a new order
 * @param   {number} userId - User ID
 * @param   {number} totalAmount - Total amount of the order
 * @param   {string} status - Status of the order
 * @param   {string} paymentStatus - Payment status of the order
 * @param   {number} shippingAddressId - ID of the shipping address
 * @param   {number} billingAddressId - ID of the billing address
 * @param   {Array}  orderDetails - Array of order details
 * @param   {string}  cartData - JSON string
 * @returns {boolean} True if the order is created successfully, false otherwise
 */
    async createOrder() {
        try {
            // Insert order
            
            const orderQuery = 'INSERT INTO Orders (user_id, total_amount, status, payment_status, shipping_address_id, billing_address_id, cart_data) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const orderValues = [this.userId, this.totalAmount, this.status, this.paymentStatus, this.shippingAddressId, this.billingAddressId, this.cartData];
            const orderResult = await dbService.query(orderQuery, orderValues);
            const orderId = orderResult.insertId;

            // Insert order details
            for (const detail of this.orderDetails) {
                const detailQuery = 'INSERT INTO OrderDetails (order_id, project_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)';
                const detailValues = [orderId, detail.project_id, detail.quantity, detail.unit_price, detail.total_price];
                await dbService.query(detailQuery, detailValues);
            }
            return orderId;
        } catch (error) {
            console.error('Error creating order:', error);
            return false;
        }
    }

/**
 * Get orders by user ID
 * @param   {number} userId - User ID
 * @returns {Array}  Array of orders belonging to the user
 */
    static async getOrdersByUserId(userId) {
        try {
            const query = 'SELECT * FROM Orders WHERE user_id = ?';
            const result = await dbService.query(query, [userId]);
            return result;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    }
 
/**
 * Update order status by order ID
 * @param   {number} userId - User ID
 * @param   {number} orderId - Order ID
 * @param   {string} status - New status for the order
 * @returns {boolean} True if the order status is updated successfully, false otherwise
 */    
    async updateOrderStatus(userId, orderId, status) {
        try {
            const query = 'UPDATE Orders SET status = ? WHERE user_id=? and order_id = ?';
            const values = [status, userId, orderId];
            await dbService.query(query, values);
            return true;
        } catch (error) {
            console.error('Error updating order status:', error);
            return false;
        }
    }
    
/**
 * Update order payment status by order ID
 * @param   {number} userId - User ID
 * @param   {number} orderId - Order ID
 * @param   {string} status - New status for the order
 * @returns {boolean} True if the order status is updated successfully, false otherwise
 */    
    async updateOrderPaymentStatus(userId, orderId, status) {
        try {
            const query = 'UPDATE Orders SET payment_status = ? WHERE user_id=? and order_id = ?';
            const values = [status, userId, orderId];
            await dbService.query(query, values);
            return true;
        } catch (error) {
            console.error('Error updating order payment status:', error);
            return false;
        }
    }

    // Implement other methods as needed
}

module.exports = Order;
