/*
 * Controller Name: UploadController
 * Filename: uploadController.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: Controller for uploading user's album template on S3 and save in database.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const dbService = require('../services/dbService');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const sharp = require('sharp');

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

        const { userId, metaData, file } = req.body;
        
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
        const imageUrl = `public/users/photos/${userId}/${fileName}`;
        const thumbnail200Url = `public/users/photos/${userId}/200/${fileName}`;
        const thumbnail500Url = `public/users/photos/${userId}/500/${fileName}`;

        // Generate thumbnail
        // const thumbnail200Buffer = await generateThumbnail(buffer, 200, 200);
        // const thumbnail500Buffer = await generateThumbnail(buffer, 500, 500);
        const [thumbnail200, thumbnail500] = await generateThumbnails(buffer)
     
        // Upload both the original image and the thumbnail to S3 simultaneously
        const uploadPromises = [
            uploadToS3(imageUrl, buffer, fileType),
            uploadToS3(thumbnail200Url, thumbnail200, fileType),
            uploadToS3(thumbnail500Url, thumbnail500, fileType)
        ];

        // Wait for both uploads to complete
        await Promise.all(uploadPromises);


        // Insert image metadata into the database
        const query = 'INSERT INTO UserImages (user_id, file_name, file_size, file_type, url, property) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [userId, fileName, fileSize, fileType, imageUrl, metaData];

        try {
            const result = await dbService.query(query, values);

            console.log('Image metadata inserted into database');
            res.status(200).json({ imageUrl: imageUrl });
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
// async function generateThumbnail(buffer, width=200, height=200) {
//     // Use Sharp to resize and convert the image to a thumbnail
//     const thumbnailBuffer = await sharp(buffer)
//         .resize({ width: width, height: height })
//         .toBuffer();

//     return thumbnailBuffer;
// }

async function generateThumbnails(buffer) {
    const thumbnail200 = await sharp(buffer)
        .resize({ width: 200, height: 200, fit: 'inside', withoutEnlargement: true })
        .toBuffer();
    
    const thumbnail500 = await sharp(buffer)
        .resize({ width: 500, height: 500, fit: 'inside', withoutEnlargement: true })
        .toBuffer();

    return [thumbnail200, thumbnail500];
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

/**
 * Uploads a JSON file to an AWS S3 bucket.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void}
 */
async function uploadJSON(req, res) {
  try {
      const { albumId, json } = req.body;

      // Check if request body and JSON data property exist
      if (!req.body || !json) {
          return res.status(400).send("JSON data is missing");
      }

      // Convert JSON to string
      const jsonData = JSON.stringify(json);
      
      // Specify the key (file name) under which the file will be stored in S3
      const fileName = `public/users/album/${albumId}_data.json`;

      const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileName,
          Body: jsonData,
          ContentType: 'application/json' // Specify the content type of the file
      };

      // Upload the JSON file to S3
      const command = new PutObjectCommand(params);
      const data = await s3Client.send(command);

      if (!data) {
          console.error('Error uploading JSON file:', fileName);
          res.status(500).json({ message: 'Error uploading JSON file' });
      } else {
          console.log('JSON file uploaded successfully:', data);
          res.status(200).json({ fileName: fileName });
      }
  } catch (error) {
      console.error("Error uploading JSON file to S3:", error);
      res.status(500).send("Error uploading JSON file");
  }
}

/**
 * Uploads a file to an AWS S3 bucket.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void}
 */
async function uploadFiles(req, res) {
  try {
    const { userId, file } = req.body;

    // Check if request body and file data property exist
    if (!req.body || !file) {
        return res.status(400).send("File data is missing");
    }

    // Convert file data from base64 string to buffer
    const fileData = Buffer.from(file, 'base64');

    // Specify the key (file name) under which the file will be stored in S3
    const fileName = `public/users/files/${userId}/${Date.now()}_file`;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileData
    };

    // Upload the file to S3
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);

    if (!data) {
        console.error('Error uploading file:', fileName);
        res.status(500).json({ message: 'Error uploading file' });
    } else {
        console.log('File uploaded successfully:', data);
        res.status(200).json({ fileName: fileName });
      }
  } catch (error) {
      console.error("Error uploading JSON file to S3:", error);
      res.status(500).send("Error uploading JSON file");
  }
}

/**
 * Uploads a file to an AWS S3 bucket using binary data.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void}
 */
const uploadFile = async (req, res) => {
  try {
    const { userId } = req.body;
      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
      }

      const { originalname, mimetype, buffer } = req.file;

      // Generate a unique filename
      const fileName = `public/users/files//${userId}/${uuidv4()}-${originalname}`;

      // Specify the S3 upload parameters
      const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: mimetype,
          ACL: 'public-read' // Optionally, set the access control level
      };

      // Upload the file to S3
      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      // Construct the public URL for the uploaded file
      const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

      res.status(200).json({
          message: 'File uploaded successfully',
          file: {
              name: originalname,
              size: buffer.length,
              url: fileUrl
          }
      });
  } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Error uploading file' });
  }
};

module.exports = {
  uploadImage, // Export the uploadImage function
  uploadJSON,   // Export the uploadJSON function
  uploadFile   // Export the uploadFile function
};