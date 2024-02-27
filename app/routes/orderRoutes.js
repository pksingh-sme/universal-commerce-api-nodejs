/*
 * Filename: orderRoutes.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Description: Routes for managing orders
 * Version: 1.0
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authService = require('../services/authService');

// Route to create a new order
router.post('/create', authService.authenticate, orderController.createOrder);

// Route to update order status
router.put('/:userId/:orderId/status', authService.authenticate, orderController.updateOrderStatus);

// Route to update order payment status
router.put('/:userId/:orderId/payment', authService.authenticate, orderController.updateOrderPaymentStatus);

// Route to get orders by user ID
router.get('/user/:userId', authService.authenticate, orderController.getOrdersByUserId);

// Implement other routes as needed

module.exports = router;
