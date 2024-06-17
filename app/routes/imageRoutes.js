/*
 * Filename: imageRoutes.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Description: Routes for uploading images over S3
 * Version: 1.0
 */

const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Route to handle upload files on S3 and save in database
router.post("/upload", imageController.uploadImage); // Use the uploadImage function from the imageController
router.get("/:userId", imageController.getUserImages); // Use to get user images from database

module.exports = router;
