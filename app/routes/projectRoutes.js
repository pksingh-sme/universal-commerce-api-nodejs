/*
 * Filename: projectRoutes.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Description: Routes for managing projects
 * Version: 1.0
 */

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const uploadController = require('../controllers/uploadController');
const authService = require('../services/authService');

// Route to create a new project
router.post('/', authService.authenticate, projectController.createProject);

// Route to get projects by user ID
router.get('/user/:userId', authService.authenticate, projectController.getProjectsByUserId);

// Route to get project by project ID
router.get('/:projectId', authService.authenticate, projectController.getProjectById);

// Route to get project by project ID
//router.get('/json/:projectId', authService.authenticate, uploadController.readJSON);
router.get('/json/:projectId', uploadController.readJSON);

// Route to update project status
router.put('/:projectId/status', authService.authenticate, projectController.updateProjectStatus);

// Route to update project data
router.put('/:projectId/data', authService.authenticate, projectController.updateProjectData);

// Route to update project details
router.put('/:projectId', authService.authenticate, projectController.updateProject);

// Route to delete a project
router.delete('/:projectId', authService.authenticate, projectController.deleteProject);

module.exports = router;
