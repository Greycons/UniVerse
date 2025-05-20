const Event = require('../models/event.model');
const Club = require('../models/club.model');

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, club, startDate, endDate, location, capacity, type, tags } = req.body;
        const userId = req.user.id;

        // Validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        // Check if user is authorized to create event for the club
        const clubDoc = await Club.findById(club);
        if (!clubDoc) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        if (!clubDoc.members.some(member => 
            member.user.toString() === userId && 
            ['admin', 'moderator'].includes(member.role)
        )) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to create events for this club'
            });
        }

        const event = new Event({
            title,
            description,
            club,
            organizer: userId,
            startDate,
            endDate,
            location,
            capacity,
            type,
            tags: tags || []
        });

        await event.save();

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const { status, type, club } = req.query;
        const query = {};

        if (status) query.status = status;
        if (type) query.type = type;
        if (club) query.club = club;

        const events = await Event.find(query)
            .populate('club', 'name')
            .populate('organizer', 'username')
            .sort({ startDate: 1 });

        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId)
            .populate('club', 'name')
            .populate('organizer', 'username')
            .populate('registeredUsers.user', 'username');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event is full
        if (event.isFull) {
            return res.status(400).json({
                success: false,
                message: 'Event is full'
            });
        }

        // Check if user is already registered
        if (event.isUserRegistered(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'Already registered for this event'
            });
        }

        event.registeredUsers.push({
            user: req.user.id
        });

        await event.save();

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update event status
exports.updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is authorized to update event
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this event'
            });
        }

        event.status = status;
        await event.save();

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search events
exports.searchEvents = async (req, res) => {
    try {
        const { query } = req.query;
        const events = await Event.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .populate('club', 'name')
        .populate('organizer', 'username');

        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 