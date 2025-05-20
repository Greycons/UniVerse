const User = require('../models/user.model');
const Permission = require('../models/permission.model');
const Event = require('../models/event.model');
const Club = require('../models/club.model');

const adminController = {
    // Get admin dashboard
    getDashboard: async (req, res) => {
        try {
            // Check if user is admin
            if (req.user.role !== 'admin') {
                return res.redirect('/');
            }

            // Get statistics
            const stats = {
                totalUsers: await User.countDocuments(),
                pendingPermissions: await Permission.countDocuments({ status: 'pending' }),
                activeEvents: await Event.countDocuments({ status: 'active' }),
                activeClubs: await Club.countDocuments({ status: 'active' })
            };

            // Get recent activities (last 10)
            const permissions = await Permission.find()
                .populate('user', 'username')
                .sort({ createdAt: -1 })
                .limit(10)
                .exec();

            const activities = permissions.map(permission => ({
                timestamp: permission.createdAt,
                user: permission.user,
                action: 'Permission Request',
                details: `${permission.type} - ${permission.status}`
            }));

            res.render('admin/dashboard', {
                title: 'Admin Dashboard',
                user: req.user,
                stats,
                activities
            });
        } catch (error) {
            console.error('Admin dashboard error:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Error loading admin dashboard',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Get all users (admin view)
    getUsers: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.redirect('/');
            }

            const users = await User.find().select('-password');
            res.render('admin/users', {
                title: 'Manage Users',
                user: req.user,
                users
            });
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Error loading users',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Get pending permissions (admin view)
    getPendingPermissions: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.redirect('/');
            }

            const permissions = await Permission.find({ status: 'pending' })
                .populate('user', 'username email')
                .sort({ createdAt: -1 });

            res.render('admin/permissions', {
                title: 'Pending Permissions',
                user: req.user,
                permissions
            });
        } catch (error) {
            console.error('Get pending permissions error:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Error loading pending permissions',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Update user role
    updateUserRole: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update user roles'
                });
            }

            const { userId } = req.params;
            const { role } = req.body;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            user.role = role;
            await user.save();

            res.json({
                success: true,
                message: 'User role updated successfully'
            });
        } catch (error) {
            console.error('Update user role error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = adminController; 