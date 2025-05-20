const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// View routes
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/logout', authController.logout);

// API routes
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', authController.logout);

module.exports = router; 