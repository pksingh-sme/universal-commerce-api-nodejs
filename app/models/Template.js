/*
 * Model Name: Template
 * Filename: Template.js
 * Author: Pramod K Singh
 * Date: July 2024
 * Description: 
 *  Model for manage user's Template in the application. 
 *  It contains methods to interact with the database regarding user templates.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const dbService = require('../services/dbService');

class Template {

    /**
     * Retrieves all templates associated with a specific user ID from the database.
     * @param {number} userId - The ID of the user.
     * @returns {Array} - An array of templates belonging to the specified user.
     */    
    static async getAllTemplatesByUserId(userId) {
        try {
            const result = await dbService.query('SELECT * FROM Templates WHERE user_id = ?', [userId]);
            return result; // Returns the projetc(s) found           
        } catch (error) {
            console.error('Error fetching templates:', error);
            return [];
        }
    }

    /**
     * Retrieves all templates associated with a specific product code from the database.
     * @param {string} productCode - The code of the product.
     * @returns {Array} - An array of templates belonging to the specified product.
     */    
    static async getAllTemplatesByProductCode(productCode) {
        try {
            const result = await dbService.query('SELECT * FROM Templates WHERE product_code = ?', [productCode]);
            return result; // Returns the projetc(s) found           
        } catch (error) {
            console.error('Error fetching templates:', error);
            return [];
        }
    }


    /**
     * Retrieves all templates associated with a specific product code from the database.
     * @param {string} groupCode - The code of the product.
     * @returns {Array} - An array of templates belonging to the specified product.
     */    
    static async getAllTemplatesByGroupCode(groupCode) {
        try {
            const result = await dbService.query('SELECT * FROM Templates WHERE group_code = ?', [groupCode]);
            return result; // Returns the projetc(s) found           
        } catch (error) {
            console.error('Error fetching templates:', error);
            return [];
        }
    }


    /**
     * Retrieves all templates associated with a specific product code from the database.
     * @param {string} themeCode - The code of the product.
     * @returns {Array} - An array of templates belonging to the specified product.
     */    
    static async getAllTemplatesByThemeCode(themeCode) {
        try {
            const result = await dbService.query('SELECT * FROM Templates WHERE theme_code = ?', [themeCode]);
            return result; // Returns the projetc(s) found           
        } catch (error) {
            console.error('Error fetching templates:', error);
            return [];
        }
    }
 
    /**
     * Retrieves a template by its ID from the database.
     * @param {number} templateId - The ID of the template.
     * @returns {Array} - An array containing the template details.
     */
    static async getTemplateById(templateId) {
        try {
            const templateIds = templateId.split(',');

            // Generate placeholders for SQL query
            const placeholders = templateIds.map(() => '?').join(',');
            const query = `SELECT * FROM Templates WHERE id IN (${placeholders})`;
            const result = await dbService.query(query, templateIds);
            return result;
        } catch (error) {
            console.error('Error fetching templates:', error);
            return [];
        }
    }

    /**
     * Updates the details of a template in the database.
     * @param {number} templateId - The ID of the template to update.
     * @param {number} userId - The ID of the user to update.
     * @param {string} content - The new name of the template.
     * @returns {boolean} - True if the template is successfully updated, false otherwise.
     */    
    static async updateTemplateContent(templateId, content) {
        try {
            //templateId, content, productCode, groupCode, themeCode, tags
            const query = 'UPDATE Templates SET content = ? WHERE id = ?';
            const values = [content, templateId];
            await dbService.query(query, values);
            return true;
        } catch (error) {
            console.error('Error updating template:', error);
            return false;
        }
    }

    /**
     * Updates the status of a template in the database.
     * @param {number} templateId - The ID of the template to update.
     * @param {string} status - The new status of the template.
     * @returns {boolean} - True if the template status is successfully updated, false otherwise.
     */    
    static async updateProperty(templateId, property) {
        try {
            const query = 'UPDATE Templates SET property = ? WHERE id = ?';
            const values = [property, templateId];
            await dbService.query(query, values);
            return true;
        } catch (error) {
            console.error('Error updating template status:', error);
            return false;
        }
    }    

    /**
     * Updates the additional data of a template in the database.
     * @param {number} templateId - The ID of the template to update.
     * @param {string} content - The new additional data to be associated with the template.
     * @returns {boolean} - True if the template data is successfully updated, false otherwise.
     */    
    static async updateTemplateData(templateId, content) {
        try {
            const query = 'UPDATE Templates SET content = ? WHERE id = ?';
            const values = [content, templateId];
            await dbService.query(query, values);
            return true;
        } catch (error) {
            console.error('Error updating template data:', error);
            return false;
        }
    }       

    /**
     * Deletes a template from the database.
     * @param {number} templateId - The ID of the template to delete.
     * @returns {boolean} - True if the template is successfully deleted, false otherwise.
     */    
    static async deleteTemplate(templateId) {
        try {
            const query = 'DELETE FROM Templates WHERE id = ?';
            await dbService.query(query, [templateId]);
            return true;
        } catch (error) {
            console.error('Error deleting template:', error);
            return false;
        }
    }

    // Implement other methods as needed
}

module.exports = Template;
