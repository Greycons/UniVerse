const Permission = require('../models/permission.model');
const User = require('../models/user.model');

// Create a new permission request
exports.createPermission = async (req, res) => {
    try {
        const { type, title, description, startDate, endDate, attachments } = req.body;
        const userId = req.user.id;

        // Validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        const permission = new Permission({
            user: userId,
            type,
            title,
            description,
            startDate,
            endDate,
            attachments: attachments || []
        });

        await permission.save();

        res.status(201).json({
            success: true,
            data: permission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all permissions for a user
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

// Get all pending permissions (for admins)
exports.getPendingPermissions = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view pending permissions'
            });
        }

        const permissions = await Permission.find({ status: 'pending' })
            .populate('user', 'username email')
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

// Update permission status
exports.updatePermissionStatus = async (req, res) => {
    try {
        const { permissionId } = req.params;
        const { status, comment } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update permission status'
            });
        }

        const permission = await Permission.findById(permissionId);
        if (!permission) {
            return res.status(404).json({
                success: false,
                message: 'Permission not found'
            });
        }

        permission.status = status;
        permission.approvedBy = req.user.id;
        permission.approvedAt = new Date();

        if (comment) {
            permission.comments.push({
                user: req.user.id,
                text: comment
            });
        }

        await permission.save();

        res.status(200).json({
            success: true,
            data: permission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add comment to permission
exports.addComment = async (req, res) => {
    try {
        const { permissionId } = req.params;
        const { text } = req.body;

        const permission = await Permission.findById(permissionId);
        if (!permission) {
            return res.status(404).json({
                success: false,
                message: 'Permission not found'
            });
        }

        // Check if user is authorized to comment
        if (req.user.role !== 'admin' && permission.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to comment on this permission'
            });
        }

        permission.comments.push({
            user: req.user.id,
            text
        });

        await permission.save();

        res.status(200).json({
            success: true,
            data: permission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 