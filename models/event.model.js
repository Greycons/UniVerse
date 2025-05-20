const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true,
        index: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    startDate: {
        type: Date,
        required: true,
        index: true
    },
    endDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        default: 0
    },
    registeredUsers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming',
        index: true
    },
    type: {
        type: String,
        enum: ['workshop', 'seminar', 'competition', 'social', 'other'],
        required: true,
        index: true
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true,
    collection: 'events'
});

// Indexes for common queries
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ club: 1, status: 1 });
eventSchema.index({ 'registeredUsers.user': 1 });

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
    return this.capacity > 0 && this.registeredUsers.length >= this.capacity;
});

// Method to check if user is registered
eventSchema.methods.isUserRegistered = function(userId) {
    return this.registeredUsers.some(reg => reg.user.toString() === userId.toString());
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 