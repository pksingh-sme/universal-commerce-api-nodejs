/*
 * Controller Name: UploadController
 * Filename: uploadController.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: Controller for uploading user's album template on S3 and save in database.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */
const crypto = require('crypto');
const dbService = require('../services/dbService');
const { encrypt, decrypt,encryptiotnKey } = require('../services/encryption'); 

const { S3Client, PutObjectCommand, GetObjectCommand  } = require("@aws-sdk/client-s3");
//const { Readable } = require('stream');

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

        const { userId, metaData, fileName, file } = req.body;
        
        //Check if request body and file property exist
        if (!req.body || !file) {
          return res.status(400).send("Base64-encoded file data is missing");
        }
    
        // Split base64 string and decode
        const base64Data = file.split(';base64,').pop();
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Specify the key (file name) under which the file will be stored in S3
        //const fileName = `${Date.now()}.jpg`;
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
    //   const key = crypto.randomBytes(32); // 256-bit key
    //   const iv = crypto.randomBytes(16);  // 128-bit IV
      const key = encryptiotnKey(albumId); // 256-bit key
      const iv = encryptiotnKey(albumId, 16);  // 128-bit IV

      const encryptionDataString = JSON.stringify({
        key: key.toString('hex'),
        iv: iv.toString('hex')
      });

      const encryptedText = encrypt(jsonData, key, iv);
      // Specify the key (file name) under which the file will be stored in S3
      const fileName = `public/users/album/${albumId}_data.json`;

      const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileName,
          Body: encryptedText,
          ContentType: 'application/json', // Specify the content type of the file
          Metadata: {
            encryption_data: encryptionDataString
          }
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
 * Create/Uploads template image file to an AWS S3 bucket and stores its metadata in a database.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A Promise representing the asynchronous operation.
 */
async function createTemplate(req, res) {
  try {

      const { templateId, userId, content, type, productCode, groupCode, themeCode, tags, byteArray } = req.body;
      
      //Check if request body and byteArray property exist
      if (!req.body || !byteArray) {
        return res.status(400).send("Base64-encoded file data is missing");
      }
  
      // Split base64 string and decode
      const base64Data = byteArray.split(';base64,').pop();
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `${Date.now()}.jpg`;
      
      //const fileSize = Buffer.byteLength(buffer);
      const fileType = `image/jpeg`;
      const imageUrl = `public/templates/${userId}/${fileName}`;
      const thumbnail200Url = `public/templates/${userId}/200/${fileName}`;
      const thumbnail500Url = `public/templates/${userId}/500/${fileName}`;

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
      let query = "";
      let values = "";
      if (templateId && templateId > 0){
      // Update template data into the database
        query = 'UPDATE Templates SET user_id = ?, content = ?, file_type = ?, product_code = ?, group_code = ?, theme_code = ?, url = ?, property = ? WHERE id = ?';
        values = [userId, content, type, productCode, groupCode, themeCode, imageUrl, tags, templateId];
      }else{
      // Insert template data into the database
        query = 'INSERT INTO Templates (user_id, content, file_type, product_code, group_code, theme_code, url, property) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        values = [userId, content, type, productCode, groupCode, themeCode, imageUrl, tags];
      }

      try {
          const result = await dbService.query(query, values);
          
          const id = templateId ? templateId : result.insertId;
          console.log('Template content inserted into database');
          res.status(200).json({ templateId: id, imageUrl: imageUrl });
      } catch (err) {
          console.error('Error inserting template content into database:', err);
          res.status(500).json({ message: 'Error inserting template content into database' });
      }

  } catch (error) {
      console.error("Error uploading file to S3:", error);
      res.status(500).send("Error uploading file");
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
    const { userId, type, metaData } = req.body;
      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
      }

      const { originalname, mimetype, buffer } = req.file;
      
      const fileName = generateFileName(originalname);
      // Generate a unique filename
      let imageUrl = `public/users/files/${userId}/${fileName}`;
      let thumbnail200Url = "";
      let thumbnail500Url = "";

      let uploadPromises= [];
 
      if(type == "PHOTO"){
        imageUrl = `public/users/photos/${userId}/${fileName}`;
        thumbnail200Url = `public/users/photos/${userId}/200/${fileName}`;
        thumbnail500Url = `public/users/photos/${userId}/500/${fileName}`;
        const [thumbnail200, thumbnail500] = await generateThumbnails(buffer)
 
        // Upload both the original image and the thumbnail to S3 simultaneously
        uploadPromises = [
            uploadToS3(imageUrl, buffer, mimetype),
            uploadToS3(thumbnail200Url, thumbnail200, mimetype),
            uploadToS3(thumbnail500Url, thumbnail500, mimetype)
        ];        
      }else if(type == "ALBUM"){
        imageUrl = `public/users/album/${userId}/${generateFileName(originalname)}`;
        uploadPromises = [
            uploadToS3(imageUrl, buffer, mimetype)
        ]
      }else{
        uploadPromises = [
            uploadToS3(imageUrl, buffer, mimetype)
        ]
      }

    //   // Specify the S3 upload parameters
    //   const params = {
    //       Bucket: process.env.S3_BUCKET_NAME,
    //       Key: fileName,
    //       Body: buffer,
    //       ContentType: mimetype,
    //      // ACL: 'public-read' // Optionally, set the access control level
    //   };

    //   // Upload the file to S3
    //   const command = new PutObjectCommand(params);
    //   await s3Client.send(command);


    // Generate thumbnail

 //   const [thumbnail200, thumbnail500] = await generateThumbnails(buffer)
 
    // Upload both the original image and the thumbnail to S3 simultaneously
    // const uploadPromises = [
    //     uploadToS3(imageUrl, buffer, mimetype),
    //     uploadToS3(thumbnail200Url, thumbnail200, mimetype),
    //     uploadToS3(thumbnail500Url, thumbnail500, mimetype)
    // ];

    // Wait for both uploads to complete
    await Promise.all(uploadPromises);

      // Construct the public URL for the uploaded file
      const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${imageUrl}`;


      
        // Insert image metadata into the database
        const query = 'INSERT INTO UserImages (user_id, file_name, file_size, file_type, url, property) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [userId, imageUrl,  buffer.length, mimetype, fileUrl, metaData];
        
        try {
            const result = await dbService.query(query, values);
            
            console.log('File uploaded successfully:');
            res.status(200).json({ imageUrl: imageUrl });
        }catch(error){
            console.error("Error uploading file:", error);
            res.status(500).send("Error uploading file");
        }

  } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Error uploading file' });
  }
};

/**
 * Reads encrypted JSON content from an AWS S3 bucket, decrypts it, and returns as JSON.
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {string} key - The key (filename) of the encrypted JSON file in the bucket.
 * @param {string} projectId - The project ID used to generate the encryption key.
 * @returns {Promise<Object>} - A promise resolving to the decrypted JSON object.
 */
async function readJSON(req, res) {
    const { projectId } = req.params;

    const fileName = `public/users/album/${projectId}_data.json`;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName
    };

    try {
        // Retrieve the encrypted JSON file from S3
        const { Body, Metadata } = await s3Client.send(new GetObjectCommand(params));

        // Get encryption data (key and IV) from metadata
        const encryptionDataString = Metadata.encryption_data;
        const encryptionData = JSON.parse(encryptionDataString);
        const key = Buffer.from(encryptionData.key, 'hex');
        const iv = Buffer.from(encryptionData.iv, 'hex');

        // Read the Body stream into a Buffer
        const bodyBuffer = await streamToBuffer(Body);

        // Decrypt the encrypted JSON content
        const encryptedContent = bodyBuffer.toString('utf-8');
        const decryptedContent = decrypt(encryptedContent, key, iv);

        // Parse decrypted JSON content and return
        const jsonContent = JSON.parse(decryptedContent);
        res.status(200).json({ json: jsonContent });
    } catch (error) {
        console.error("Error reading and decrypting JSON file from S3:", error);
        res.status(500).json({ message: 'Error reading and JSON file from S3'});
    }
}

// Helper function to convert stream to buffer
async function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}

// Function to generate a random filename
function generateFileName(originalName) {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000); // Adjust the range as needed
    const fileExtension = originalName.split('.').pop();
    return `${timestamp}-${randomNumber}.${fileExtension}`;
  }


module.exports = {
  uploadImage, // Export the uploadImage function
  createTemplate, // Export the createTemplate function
  uploadJSON,   // Export the uploadJSON function
  uploadFile,   // Export the uploadFile function
  readJSON  // Export the readJSON function
};