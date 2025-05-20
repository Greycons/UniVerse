const User = require('../models/user.model');
const Club = require('../models/club.model');
const Event = require('../models/event.model');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            if (req.xhr || req.headers.accept.includes('application/json')) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            return res.status(404).render('error', {
                title: 'Error',
                message: 'User not found',
                user: null
            });
        }

        if (req.xhr || req.headers.accept.includes('application/json')) {
            return res.status(200).json({
                success: true,
                data: user
            });
        }

        res.render('profile', {
            title: 'Profile',
            user: user
        });
    } catch (error) {
        if (req.xhr || req.headers.accept.includes('application/json')) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).render('error', {
            title: 'Error',
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            user: null
        });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user.id;

        // Check if username or email is already taken
        const existingUser = await User.findOne({
            $and: [
                { _id: { $ne: userId } },
                { $or: [
                    { username: { $regex: new RegExp(`^${username}$`, 'i') } },
                    { email: { $regex: new RegExp(`^${email}$`, 'i') } }
                ]}
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user fields
        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's clubs
exports.getUserClubs = async (req, res) => {
    try {
        const userId = req.user.id;
        const clubs = await Club.find({
            'members.user': userId
        }).populate('members.user', 'username');

        res.status(200).json({
            success: true,
            data: clubs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's events
exports.getUserEvents = async (req, res) => {
    try {
        const userId = req.user.id;
        const events = await Event.find({
            $or: [
                { organizer: userId },
                { 'registeredUsers.user': userId }
            ]
        })
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

// Get user's permissions
exports.getUserPermissions = async (req, res) => {
    try {
        const userId = req.user.id;
        const permissions = await Permission.find({ user: userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: permissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view all users'
            });
        }

        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 