const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { authenticateToken } = require('../middlewares/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create a new event
router.post('/', eventController.createEvent);

// Get all events (with optional filters)
router.get('/', eventController.getAllEvents);

// Search events
router.get('/search', eventController.searchEvents);

// Get event by ID
router.get('/:eventId', eventController.getEventById);

// Register for an event
router.post('/:eventId/register', eventController.registerForEvent);

// Update event status
router.patch('/:eventId/status', eventController.updateEventStatus);

module.exports = router; 