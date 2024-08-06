/*
 * Controller Name: TemplateController
 * Filename: templateController.js
 * Author: Pramod K Singh
 * Date: July 2024
 * Description: Controller for managing user's template.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const Template = require('../models/Template');

/**
 * Retrieves all templates of a user.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route GET /api/templates/user/:userId
 * @access Private
 * @description Retrieve all templates of a user.
 */
exports.getTemplatesByUserId = async (req, res) => {
    try{
        const { userId } = req.params;
        const templates = await Template.getAllTemplatesByUserId(userId);
        res.status(200).json(templates);
    } catch (error) {
        console.error('Error in fetching template:', error);
        res.status(500).json({ message: 'Failed to fetch templates' });
    }
};

/**
 * Retrieves all templates of a product.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route GET /api/templates/product/:productCode
 * @access Private
 * @description Retrieve all templates of a product.
 */
exports.getTemplatesByProductCode = async (req, res) => {
    try{
        const { productCode } = req.params;
        const templates = await Template.getAllTemplatesByProductCode(productCode);
        res.status(200).json(templates);
    } catch (error) {
        console.error('Error in fetching template:', error);
        res.status(500).json({ message: 'Failed to fetch templates' });
    }
};

/**
 * Retrieves all templates of a group.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route GET /api/templates/group/:groupCode
 * @access Private
 * @description Retrieve all templates of a group.
 */
exports.getTemplatesByGroupCode = async (req, res) => {
    try{
        const { groupCode } = req.params;
        const templates = await Template.getAllTemplatesByGroupCode(groupCode);
        res.status(200).json(templates);
    } catch (error) {
        console.error('Error in fetching template:', error);
        res.status(500).json({ message: 'Failed to fetch templates' });
    }
};

/**
 * Retrieves all templates of a theme.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route GET /api/templates/theme/:themeCode
 * @access Private
 * @description Retrieve all templates of a theme.
 */
exports.getTemplatesByThemeCode = async (req, res) => {
    try{
        const { themeCode } = req.params;
        const templates = await Template.getAllTemplatesByThemeCode(themeCode);
        res.status(200).json(templates);
    } catch (error) {
        console.error('Error in fetching template:', error);
        res.status(500).json({ message: 'Failed to fetch templates' });
    }
};

/**
 * Retrieves a template by its ID.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route GET /api/templates/:templateId
 * @access Private
 * @description Retrieve a template by its ID.
 */
exports.getTemplateById = async (req, res) => {
    const { templateId } = req.params;
    const templates = await Template.getTemplateById(templateId);
    res.status(200).json(templates);
};

/**
 * Updates an existing template.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route PUT /api/templates/:templateId/property
 * @access Private
 * @description Update an existing template by its ID.
 */
exports.updateProperty = async (req, res) => {
    const { templateId } = req.params;
    const {tags } = req.body;
    const updated = await Template.updateProperty(templateId, tags);
    if (updated) {
        res.status(200).json({ message: 'Template tags updated successfully' });
    } else {
        res.status(500).json({ message: 'Failed to update template tags' });
    }
};


/**
 * Updates the data of a template.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route PUT /api/templates/:templateId
 * @access Private
 * @description Update the data of a template by its ID.
 */
exports.updateTemplateContent = async (req, res) => {
    const { templateId } = req.params;
    const { content } = req.body;
    const updated = await Template.updateTemplateContent(templateId, content);
    if (updated) {
        res.status(200).json({ message: 'Template content updated successfully' });
    } else {
        res.status(500).json({ message: 'Failed to update template content' });
    }
};

/**
 * Deletes a template by its ID.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route DELETE /api/templates/:templateId
 * @access Private
 * @description Delete a template by its ID.
 */
exports.deleteTemplate = async (req, res) => {
    const { templateId } = req.params;
    const deleted = await Template.deleteTemplate(templateId);
    if (deleted) {
        res.status(200).json({ message: 'Template deleted successfully' });
    } else {
        res.status(500).json({ message: 'Failed to delete template' });
    }
};

// Implement other controller methods as needed
