const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permission.controller');
const { authenticateToken } = require('../middlewares/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create a new permission request
router.post('/', permissionController.createPermission);

// Get all permissions for the authenticated user
router.get('/my-permissions', permissionController.getUserPermissions);

// Get all pending permissions (admin only)
router.get('/pending', permissionController.getPendingPermissions);

// Update permission status (admin only)
router.patch('/:permissionId/status', permissionController.updatePermissionStatus);

// Add comment to permission
router.post('/:permissionId/comments', permissionController.addComment);

module.exports = router; 