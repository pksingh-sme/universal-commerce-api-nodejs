const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.post("/upload", imageController.uploadImage); // Use the uploadImage function from the uploadController

module.exports = router;
