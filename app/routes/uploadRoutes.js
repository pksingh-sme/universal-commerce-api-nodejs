/*
 * Filename: uploadRoutes.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Description: Routes for uploading files over S3
 * Version: 1.0
 */

const express = require('express');
const multer = require('multer');

const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Route to handle upload files on S3 and save in database
router.post("/image", uploadController.uploadImage); // Use the uploadImage function from the uploadController

// Route to handle upload JSON files on S3 and save album in database
router.post("/json", uploadController.uploadJSON); // Use the uploadJSON function from the uploadController




// Route to handle upload JSON files on S3 and save album in database

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Use the original filename for uploaded files
    }
  });
  const upload = multer({ storage: storage });

router.post("/file", upload.single('file'), uploadController.uploadFile); // Use the uploadFile function from the uploadController


module.exports = router;
