/*
 * Filename: encryption.js
 * Author: Pramod K Singh
 * Date: April 2024
 * Version: 1.0
 */


const crypto = require('crypto');

// Function to encrypt a UTF-8 string
function encrypt(text, key, iv) {
    // Create a cipher object using AES-256 in CBC mode
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Update the cipher with the input text in UTF-8 encoding
    // 'hex' specifies the output format
    let encrypted = cipher.update(text, 'utf8', 'hex');

    // Finalize the encryption process
    encrypted += cipher.final('hex');

    // Return the encrypted data
    return encrypted;
}

// Function to decrypt an encrypted UTF-8 string
function decrypt(encryptedText, key, iv) {
    console.log(encryptedText);
    // Create a decipher object using AES-256 in CBC mode
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Update the decipher with the encrypted text in hexadecimal format
    // 'utf8' specifies the output format
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');

    // Finalize the decryption process
    decrypted += decipher.final('utf8');

    // Return the decrypted data
    return decrypted;
}

function encryptiotnKey(albumId, keyLength=32) {
    // Set parameters for PBKDF2
    const salt = process.env.ALBUMID_SALT; // You can set a salt if needed, for simplicity we leave it empty
    const iterations = 10000; // Number of iterations
    //const keyLength = 32; // Desired key length in bytes (256 bits)

    // Generate key using PBKDF2
    const key = crypto.pbkdf2Sync(albumId, salt, iterations, keyLength, 'sha256');

    return key;
}


// Export the functions to make them accessible from other modules
module.exports = { encrypt, decrypt, encryptiotnKey };
