/*
 * Filename: cartRoutes.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Description: Routes for managing user's cart
 * Version: 1.0
 */

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authService = require('../services/authService');

router.get('/user/:userId', authService.authenticate, cartController.getUserCart);
router.post('/add', authService.authenticate, cartController.addToCart);
router.put('/:userId/:projectId', authService.authenticate, cartController.updateCartItem);
router.delete('/:cartId', authService.authenticate, cartController.deleteCartItem);

// Implement other routes as needed

module.exports = router;
