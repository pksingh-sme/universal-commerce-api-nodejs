/*
 * Controller Name: OrderController
 * Filename: orderController.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: Controller for managing user's orders.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const Order = require('../models/Order');

/**
 * Creates a new order.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route POST /api/orders
 * @access Public
 * @description Create a new order.
 */
exports.createOrder = async (req, res) => {
    const { userId, totalAmount, status, paymentStatus, shippingAddressId, billingAddressId, orderDetails } = req.body;
    const order = new Order(userId, totalAmount, status, paymentStatus, shippingAddressId, billingAddressId, orderDetails);
    const created = await order.createOrder();
    if (created) {
        res.status(201).json({ message: 'Order created successfully' });
    } else {
        res.status(500).json({ message: 'Failed to create order' });
    }
};

/**
 * Retrieves orders by user ID.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route GET /api/orders/:userId
 * @access Public
 * @description Get orders by user ID.
 */
exports.getOrdersByUserId = async (req, res) => {
    const { userId } = req.params;
    const orders = await Order.getOrdersByUserId(userId);
    res.status(200).json(orders);
};

/**
 * Updates the status of an order.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route PUT /api/orders/:userId/:orderId/status
 * @access Public
 * @description Update the status of an order.
 */
exports.updateOrderStatus = async (req, res) => {
    const { userId, orderId } = req.params;
    const { status } = req.body;
    const order = new Order();
    const updated = await order.updateOrderStatus(userId, orderId, status);
    if (updated) {
        res.status(200).json({ message: 'Order status updated successfully' });
    } else {
        res.status(500).json({ message: 'Failed to update order status' });
    }
};

/**
 * Updates the payment status of an order.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route PUT /api/orders/:userId/:orderId/payment-status
 * @access Public
 * @description Update the payment status of an order.
 */
exports.updateOrderPaymentStatus = async (req, res) => {
    const { userId, orderId } = req.params;
    const { status } = req.body;
    const order = new Order();
    const updated = await order.updateOrderPaymentStatus(userId, orderId, status);
    if (updated) {
        res.status(200).json({ message: 'Order payment status updated successfully' });
    } else {
        res.status(500).json({ message: 'Failed to update order payment status' });
    }
};


// Implement other controller methods as needed
