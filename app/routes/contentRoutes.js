const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// GET route to retrieve content based on language
router.get('/:lang?', contentController.getContent);

module.exports = router;
