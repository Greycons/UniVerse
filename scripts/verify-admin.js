require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const connectDB = require('../db/db.config');

async function verifyAdminUser() {
    try {
        // Connect to database
        await connectDB();
        console.log('Connected to database');

        // Find admin user
        const admin = await User.findOne({ username: 'admin' });
        if (!admin) {
            console.log('Admin user not found. Creating new admin user...');
            const newAdmin = new User({
                username: 'admin',
                email: 'admin@college.edu',
                password: 'admin123',
                role: 'admin'
            });
            await newAdmin.save();
            console.log('New admin user created successfully');
        } else {
            console.log('Admin user found:');
            console.log('Username:', admin.username);
            console.log('Email:', admin.email);
            console.log('Role:', admin.role);
            console.log('Created at:', admin.createdAt);
            console.log('Last login:', admin.lastLogin);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

verifyAdminUser(); 