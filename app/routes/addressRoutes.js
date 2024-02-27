/*
 * Filename: addressRoutes.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Description: Routes for managing user's billing and shipping addresses
 * Version: 1.0
 */

const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authService = require('../services/authService');

// Route to add a new address
router.post('/', authService.authenticate, addressController.addAddress);

// Route to get all addresses of a specific user
router.get('/user/:userId', authService.authenticate, addressController.getUserAddresses);

// Route to get a specific address by its ID
router.get('/:addressId', authService.authenticate, addressController.getAddress);

// Route to update an existing address
router.put('/:addressId', authService.authenticate, addressController.updateAddress);

// Route to delete an address
router.delete('/:addressId', authService.authenticate, addressController.deleteAddress);

module.exports = router;