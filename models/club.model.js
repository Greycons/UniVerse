const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['academic', 'sports', 'cultural', 'technical', 'other'],
        index: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        role: {
            type: String,
            enum: ['member', 'admin', 'leader'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'pending',
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'clubs'
});

// Indexes for common queries
clubSchema.index({ name: 'text', description: 'text' });
clubSchema.index({ 'members.user': 1, 'members.role': 1 });
clubSchema.index({ category: 1, status: 1 });

const Club = mongoose.model('Club', clubSchema);

module.exports = Club; 