/*
 * Filename: contentRoutes.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Description: Routes for accessing contents in different languages
 * Version: 1.0
 */

const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// GET route to retrieve content based on language
router.get('/:lang?', contentController.getContent);

module.exports = router;
