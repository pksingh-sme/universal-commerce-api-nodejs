/*
 * Filename: templateRoutes.js
 * Author: Pramod K Singh
 * Date: July 2024
 * Description: Routes for managing templates
 * Version: 1.0
 */

const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const uploadController = require('../controllers/uploadController');
const authService = require('../services/authService');

// Route to create a new template
router.post('/', authService.authenticate, uploadController.createTemplate);

// Route to get templates by user ID
router.get('/user/:userId', authService.authenticate, templateController.getTemplatesByUserId);

// Route to get templates by product code
router.get('/product/:productCode', authService.authenticate, templateController.getTemplatesByProductCode);

// Route to get templates by group code
router.get('/group/:groupCode', authService.authenticate, templateController.getTemplatesByGroupCode);

// Route to get templates by theme code
router.get('/theme/:themeCode', authService.authenticate, templateController.getTemplatesByThemeCode);

// Route to get template by template ID
router.get('/:templateId', authService.authenticate, templateController.getTemplateById);

// Route to get template by template ID
router.get('/json/:templateId', authService.authenticate, uploadController.readJSON);

// Route to update template data
router.put('/:templateId', authService.authenticate, templateController.updateTemplateContent);

// Route to update template details
router.put('/:templateId/property', authService.authenticate, templateController.updateProperty);

// Route to delete a template
router.delete('/:templateId', authService.authenticate, templateController.deleteTemplate);

module.exports = router;
