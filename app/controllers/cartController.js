/*
 * Controller Name: CartController
 * Filename: cartController.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: Controller for managing user's cart.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const Cart = require('../models/Cart');

/**
 * Adds an item to the user's cart.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 */
exports.addToCart = async (req, res) => {
    const { userId, projectId, quantity } = req.body;
    const cartItem = new Cart(userId, projectId, quantity);
    const added = await cartItem.addToCart();
    if (added) {
        res.status(201).json({ message: 'Item added to cart successfully' });
    } else {
        res.status(500).json({ message: 'Failed to add item to cart' });
    }
};

/**
 * Retrieves the user's cart.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 */
exports.getUserCart = async (req, res) => {
    try {
      const userId = req.params.userId;
      const cart = await Cart.findByUserId(userId);
      res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };

/**
 * Updates the quantity of a cart item.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 */
exports.updateCartItem = async (req, res) => {
    const { userId, projectId } = req.params;
    const { quantity } = req.body;
    const cartItem = new Cart(userId, projectId, quantity);
    const updated = await cartItem.updateCartItem(quantity);
    if (updated) {
        res.status(200).json({ message: 'Cart item updated successfully' });
    } else {
        res.status(500).json({ message: 'Failed to update cart item' });
    }
};

/**
 * Deletes a cart item.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 */
exports.deleteCartItem = async (req, res) => {
    const { cartId } = req.params;
    const deleted = await Cart.deleteCartItem(cartId);
    if (deleted) {
        res.status(200).json({ message: 'Cart item deleted successfully' });
    } else {
        res.status(500).json({ message: 'Failed to delete cart item' });
    }
};

// Implement other controller methods as needed
