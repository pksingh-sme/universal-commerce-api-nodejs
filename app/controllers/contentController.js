/*
 * Controller Name: ContetntController
 * Filename: contentController.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: Controller to get application contetnt for specific language.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const enContent = require('../locales/en.json');
const frContent = require('../locales/fr.json');

/**
 * Retrieves content based on the requested language.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void} This function does not return anything directly, but sends a response.
 */
function getContent(req, res) {
    const lang = req.params.lang || 'en'; // Default language is English

    let content;
    switch (lang) {
        case 'en':
            content = enContent;
            break;
        case 'fr':
            content = frContent;
            break;
        default:
            content = enContent;
    }

    res.json(content);
}

module.exports = {
    getContent,
};
