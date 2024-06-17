/*
 * Controller Name: AddressController
 * Filename: AddressController.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: Controller for managing user's shipping and billing addresses.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const Address = require('../models/Address');

/**
 * Adds a new address for a user.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route POST /address
 * @access Private
 * @description Add a new address for the current user.
 */
async function addAddress(req, res) {
  try {
    const { userId, type, first_name, last_name, street_address1, city, state, zip, country, phone, email, company_name, street_address2 } = req.body;
    const newAddress = new Address(userId, type, first_name, last_name, street_address1, city, state, zip, country, phone, email, company_name, street_address2);
    const addressId = await newAddress.save();
    if (addressId > 0 ) {
        res.status(201).json({ address_id:addressId, message: 'Address added successfully' });
    } else {
        res.status(500).json({ message: 'Failed to add address' });
    }
  } catch (error) {
      console.error('Error adding address:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Retrieves addresses of a user.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route GET /address/user/:userId
 * @access Private
 * @description Retrieve addresses of the current user.
 */
async function getUserAddresses (req, res) {
  try {
    const userId = req.params.userId;
    const addresses = await Address.findByUserId(userId);
    res.status(200).json(addresses);
  } catch (error) {
      console.error('Error fetching user addresses:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Retrieves an address by its ID.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route GET /address/:addressId
 * @access Private
 * @description Retrieve an address by its ID.
 */
async function getAddress (req, res) {
  try {
    const addressId = req.params.addressId;
    const addresses = await Address.findByAddressId(addressId);
    res.status(200).json(addresses);
  } catch (error) {
      console.error('Error fetching user addresses:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Updates an existing address.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route PUT /api/address/:addressId
 * @access Private
 * @description Update an existing address by its ID.
 */
async function updateAddress (req, res) {
  try {
    const addressId = req.params.addressId;
    const updateFields = req.body;
    await Address.updateAddress(addressId, updateFields);
    res.status(200).json({ message: 'Address updated successfully' });
  } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Deletes an address by its ID.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route DELETE /api/address/:addressId
 * @access Private
 * @description Delete an address by its ID.
 */
async function deleteAddress (req, res) {
  try {
    const addressId = req.params.addressId;
    await Address.deleteById(addressId);
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
    addAddress,
    getUserAddresses,
    getAddress,
    updateAddress,
    deleteAddress,
};