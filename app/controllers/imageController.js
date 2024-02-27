/*
 * Controller Name: ImageController
 * Filename: imageController.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: Controller for managing user's images to upload on S3 and save in database.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const dbService = require('../services/dbService');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads an image file to an AWS S3 bucket and stores its metadata in a database.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A Promise representing the asynchronous operation.
 */
async function uploadImage(req, res) {
    try {

        const { userId, file } = req.body;
        
        //Check if request body and file property exist
        if (!req.body || !file) {
          return res.status(400).send("Base64-encoded file data is missing");
        }
    
        // Split base64 string and decode
        const base64Data = file.split(';base64,').pop();
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Specify the key (file name) under which the file will be stored in S3
        const fileName = `${Date.now()}.jpg`;
        const fileSize = Buffer.byteLength(buffer);
        const fileType = `image/jpeg`;
        const imageUrl = `public/${userId}/${fileName}`;
     
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `${imageUrl}`, 
          Body: buffer,
          ContentType: `${fileType}`, // Specify the content type of the file
        };
    
        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);

        if (!data) {
            console.error('Error uploading image:', imageUrl);
            res.status(500).json({ message: 'Error uploading image' });
        } else {
            console.log('Image uploaded successfully:', data);

            // Insert image metadata into the database
            const query = 'INSERT INTO UserImages (user_id, file_name, file_size, file_type, url) VALUES (?, ?, ?, ?, ?)';
            const values = [userId, fileName, fileSize, fileType, imageUrl];

            try {
                const result = await dbService.query(query, values);

                console.log('Image metadata inserted into database');
                res.status(200).json({ imageUrl: imageUrl });
            } catch (err) {
                console.error('Error inserting image metadata into database:', err);
                res.status(500).json({ message: 'Error inserting image metadata into database' });
            }

        }
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        res.status(500).send("Error uploading file");
    }
}

module.exports = {
  uploadImage, // Export the uploadImage function
};