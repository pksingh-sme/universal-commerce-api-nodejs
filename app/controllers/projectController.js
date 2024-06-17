/*
 * Controller Name: ProjectController
 * Filename: projectController.js
 * Author: Pramod K Singh
 * Date: Fabruary 2024
 * Description: Controller for managing user's project.
 * Version: 1.0
 * Copyright: ©2024 Pramod K Singh. All rights reserved.
 */

const Project = require('../models/Project');

/**
 * Creates a new project.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route POST /api/projects
 * @access Private
 * @description Create a new project.
 */
exports.createProject = async (req, res) => {
    try {
        const { projectId, userId, name, description, imageUrl } = req.body;
        const existingProject = await Project.getProjectById(projectId);

        if (!existingProject.length == 1) {
            const project = new Project(projectId, userId, name, description, imageUrl);
            await project.save();
            res.status(201).json({ message: 'Project created successfully' });
        } else {
            await Project.updateProject(projectId, userId, name, description, imageUrl);
            res.status(200).json({ message: 'Project updated successfully' });
        }
    } catch (error) {
        console.error('Error creating/updating project:', error);
        res.status(500).json({ message: 'Failed to create/update project' });
    }
};

/**
 * Retrieves all projects of a user.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route GET /api/projects/user/:userId
 * @access Private
 * @description Retrieve all projects of a user.
 */
exports.getProjectsByUserId = async (req, res) => {
    try{
        const { userId } = req.params;
        const projects = await Project.getAllProjectsByUserId(userId);
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error in fetching project:', error);
        res.status(500).json({ message: 'Failed to fetch projects' });
    }
};

/**
 * Retrieves a project by its ID.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route GET /api/projects/:projectId
 * @access Private
 * @description Retrieve a project by its ID.
 */
exports.getProjectById = async (req, res) => {
    const { projectId } = req.params;
    const projects = await Project.getProjectById(projectId);
    res.status(200).json(projects);
};

/**
 * Updates an existing project.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route PUT /api/projects/:projectId
 * @access Private
 * @description Update an existing project by its ID.
 */
exports.updateProject = async (req, res) => {
    const { projectId } = req.params;
    const { name, description, imageUrl } = req.body;
    const updated = await Project.updateProject(projectId, name, description, imageUrl);
    if (updated) {
        res.status(200).json({ message: 'Project updated successfully' });
    } else {
        res.status(500).json({ message: 'Failed to update project' });
    }
};

/**
 * Updates the status of a project.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route PUT /api/projects/:projectId/status
 * @access Private
 * @description Update the status of a project by its ID.
 */
exports.updateProjectStatus = async (req, res) => {
    const { projectId } = req.params;
    const { status } = req.body;
    const updated = await Project.updateProjectStatus(projectId, status);
    if (updated) {
        res.status(200).json({ message: 'Project status updated successfully' });
    } else {
        res.status(500).json({ message: 'Failed to update project status' });
    }
};

/**
 * Updates the data of a project.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route PUT /api/projects/:projectId/data
 * @access Private
 * @description Update the data of a project by its ID.
 */
exports.updateProjectData = async (req, res) => {
    const { projectId } = req.params;
    const { data } = req.body;
    const updated = await Project.updateProjectData(projectId, data);
    if (updated) {
        res.status(200).json({ message: 'Project data updated successfully' });
    } else {
        res.status(500).json({ message: 'Failed to update project data' });
    }
};

/**
 * Deletes a project by its ID.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} This function does not return anything directly, but sends a response.
 * @route DELETE /api/projects/:projectId
 * @access Private
 * @description Delete a project by its ID.
 */
exports.deleteProject = async (req, res) => {
    const { projectId } = req.params;
    const deleted = await Project.deleteProject(projectId);
    if (deleted) {
        res.status(200).json({ message: 'Project deleted successfully' });
    } else {
        res.status(500).json({ message: 'Failed to delete project' });
    }
};

// Implement other controller methods as needed
