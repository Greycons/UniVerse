const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['leave', 'event', 'club', 'facility', 'other'],
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    attachments: [{
        name: String,
        url: String,
        type: String
    }]
}, {
    timestamps: true,
    collection: 'permissions'
});

// Indexes for common queries
permissionSchema.index({ user: 1, status: 1 });
permissionSchema.index({ type: 1, status: 1 });
permissionSchema.index({ startDate: 1, endDate: 1 });
permissionSchema.index({ 'comments.user': 1 });

// Method to check if permission is active
permissionSchema.methods.isActive = function() {
    const now = new Date();
    return this.status === 'approved' && 
           this.startDate <= now && 
           this.endDate >= now;
};

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission; 