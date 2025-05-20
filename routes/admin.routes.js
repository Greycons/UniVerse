const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { checkAuth, checkAdmin } = require('../middlewares/checkAuth');

// Apply authentication and admin role middleware to all routes
router.use(checkAuth);
router.use(checkAdmin);

// Admin dashboard
router.get('/dashboard', adminController.getDashboard);

// User management
router.get('/users', adminController.getUsers);
router.patch('/users/:userId/role', adminController.updateUserRole);

// Permission management
router.get('/permissions', adminController.getPendingPermissions);

module.exports = router; 