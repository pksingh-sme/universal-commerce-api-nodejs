/*
 * Controller Name: ImageController
 * Filename: imageController.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Description: Controller for managing user's images to upload on S3 and save in the database.
 * Version: 1.1
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const dbService = require('../services/dbService');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require('sharp');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/**
 * Uploads an image file to an AWS S3 bucket, generates a thumbnail, and stores metadata in a database.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A Promise representing the asynchronous operation.
 */
async function uploadImage(req, res) {
    try {
        const { userId, file } = req.body;

        // Check if request body and file property exist
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
        const imageUrl = `public/${userId}/images/${fileName}`;
        const thumbnail200Url = `public/${userId}/200/${fileName}`;
        const thumbnail500Url = `public/${userId}/500/${fileName}`;

        // Generate thumbnail
        const thumbnail200Buffer = await generateThumbnail(buffer, 200, 200);
        const thumbnail500Buffer = await generateThumbnail(buffer, 500, 500);

        // Upload both the original image and the thumbnail to S3 simultaneously
        const uploadPromises = [
            uploadToS3(imageUrl, buffer, fileType),
            uploadToS3(thumbnail200Url, thumbnail200Buffer, fileType),
            uploadToS3(thumbnail500Url, thumbnail500Buffer, fileType)
        ];

        // Wait for both uploads to complete
        await Promise.all(uploadPromises);

        // Insert image metadata into the database
        const query = 'INSERT INTO UserImages (user_id, file_name, file_size, file_type, url, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [userId, fileName, fileSize, fileType, imageUrl, thumbnail200Url];

        try {
            const result = await dbService.query(query, values);

            console.log('Image metadata inserted into database');
            res.status(200).json({ imageUrl: imageUrl, thumbnailUrl: thumbnail200Url });
        } catch (err) {
            console.error('Error inserting image metadata into database:', err);
            res.status(500).json({ message: 'Error inserting image metadata into database' });
        }
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        res.status(500).send("Error uploading file");
    }
}

/**
 * Generates a thumbnail from the given image buffer.
 * @param {Buffer} buffer - The image buffer.
 * @returns {Promise<Buffer>} A Promise that resolves with the thumbnail buffer.
 */
async function generateThumbnail(buffer, width=200, height=200) {
    // Use Sharp to resize and convert the image to a thumbnail
    const thumbnailBuffer = await sharp(buffer)
        .resize({ width: width, height: height })
        .toBuffer();

    return thumbnailBuffer;
}

/**
 * Uploads the given buffer to S3 with the specified key and content type.
 * @param {string} key - The S3 object key.
 * @param {Buffer} buffer - The buffer to upload.
 * @param {string} contentType - The content type of the buffer.
 * @returns {Promise<void>} A Promise representing the asynchronous operation.
 */
async function uploadToS3(key, buffer, contentType) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType
    };

    await s3Client.send(new PutObjectCommand(params));
}

async function getUserImages (req, res) {
    const { userId } = req.params;
    try {
        const result = await dbService.query('SELECT url, property FROM UserImages WHERE user_id = ? ORDER BY uploaded_at DESC', [userId]);
        res.status(200).json(result); // Returns the image(s) found           
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Failed to fetch images' });
    }
};

module.exports = {
    uploadImage, // Export the uploadImage function
    getUserImages, // Get list of images uploaded by users
};
