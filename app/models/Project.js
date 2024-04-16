/*
 * Model Name: Project
 * Filename: Project.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: 
 *  Model for manage user's Project in the application. 
 *  It contains methods to interact with the database regarding user projects.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const dbService = require('../services/dbService');

class Project {

    /**
     * Creates an instance of Project.
     * @param {number} userId - The ID of the user who owns the project.
     * @param {string} name - The name of the project.
     * @param {string} description - The description of the project.
     * @param {string} imageUrl - The URL of the image associated with the project.
     * @param {string} [status='Pending'] - The status of the project (default: 'Pending').
     */    
    constructor(projectId, userId, name, description, imageUrl, status='Pending') {
        this.projectId = projectId;
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.status = status;
    }

    /**
     * Saves the project to the database.
     * @returns {boolean} - True if the project is successfully saved, false otherwise.
     */    
    async save() {
        try {
            const query = 'INSERT INTO Projects (project_id, user_id, name, description, image_url) VALUES (?, ?, ?, ?, ?)';
            const values = [this.projectId, this.userId, this.name, this.description, this.imageUrl];
            await dbService.query(query, values);
            return true;
        } catch (error) {
            console.error('Error saving project:', error);
            return false;
        }
    }


    /**
     * Retrieves all projects associated with a specific user ID from the database.
     * @param {number} userId - The ID of the user.
     * @returns {Array} - An array of projects belonging to the specified user.
     */    
    static async getAllProjectsByUserId(userId) {
        try {
            const result = await dbService.query('SELECT * FROM Projects WHERE user_id = ?', [userId]);
            return result; // Returns the projetc(s) found           
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    }

 
    /**
     * Retrieves a project by its ID from the database.
     * @param {number} projectId - The ID of the project.
     * @returns {Array} - An array containing the project details.
     */
    static async getProjectById(projectId) {
        try {
            const query = 'SELECT * FROM Projects WHERE project_id = ?';
            const [rows] = await dbService.query(query, [projectId]);
            return rows;
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    }

    /**
     * Updates the details of a project in the database.
     * @param {number} projectId - The ID of the project to update.
     * @param {string} name - The new name of the project.
     * @param {string} description - The new description of the project.
     * @param {string} imageUrl - The new URL of the image associated with the project.
     * @returns {boolean} - True if the project is successfully updated, false otherwise.
     */    
    static async updateProject(projectId, userId, name, description, imageUrl) {
        try {
            const query = 'UPDATE Projects SET name = ?, description = ?, image_url = ? WHERE project_id = ? AND user_id = ?';
            const values = [name, description, imageUrl, projectId, userId];
            await dbService.query(query, values);
            return true;
        } catch (error) {
            console.error('Error updating project:', error);
            return false;
        }
    }

    /**
     * Updates the status of a project in the database.
     * @param {number} projectId - The ID of the project to update.
     * @param {string} status - The new status of the project.
     * @returns {boolean} - True if the project status is successfully updated, false otherwise.
     */    
    static async updateProjectStatus(projectId, status) {
        try {
            const query = 'UPDATE Projects SET status = ? WHERE project_id = ?';
            const values = [status, projectId];
            await dbService.query(query, values);
            return true;
        } catch (error) {
            console.error('Error updating project status:', error);
            return false;
        }
    }    

    /**
     * Updates the additional data of a project in the database.
     * @param {number} projectId - The ID of the project to update.
     * @param {string} data - The new additional data to be associated with the project.
     * @returns {boolean} - True if the project data is successfully updated, false otherwise.
     */    
    static async updateProjectData(projectId, data) {
        try {
            const query = 'UPDATE Projects SET data = ? WHERE project_id = ?';
            const values = [data, projectId];
            await dbService.query(query, values);
            return true;
        } catch (error) {
            console.error('Error updating project data:', error);
            return false;
        }
    }       

    /**
     * Deletes a project from the database.
     * @param {number} projectId - The ID of the project to delete.
     * @returns {boolean} - True if the project is successfully deleted, false otherwise.
     */    
    static async deleteProject(projectId) {
        try {
            const query = 'DELETE FROM Projects WHERE project_id = ?';
            await dbService.query(query, [projectId]);
            return true;
        } catch (error) {
            console.error('Error deleting project:', error);
            return false;
        }
    }

    // Implement other methods as needed
}

module.exports = Project;
