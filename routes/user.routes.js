const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { checkAuth } = require('../middlewares/checkAuth');

// Apply authentication middleware to all routes
router.use(checkAuth);

// Get user profile
router.get('/profile', userController.getUserProfile);

// Update user profile
router.patch('/profile', userController.updateUserProfile);

// Change password
router.post('/change-password', userController.changePassword);

// Get user's clubs
router.get('/clubs', userController.getUserClubs);

// Get user's events
router.get('/events', userController.getUserEvents);

// Get user's permissions
router.get('/permissions', userController.getUserPermissions);

// Get all users (admin only)
router.get('/', userController.getAllUsers);

module.exports = router; 