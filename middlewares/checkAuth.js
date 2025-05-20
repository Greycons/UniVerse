const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    // Check for session-based authentication first
    if (req.session && req.session.user) {
        req.user = req.session.user;
        return next();
    }

    // If no session, check for JWT token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // For API requests, return JSON response
        if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        // For browser requests, redirect to login
        return res.redirect('/auth/login');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request
        req.user = decoded;
        
        next();
    } catch (error) {
        // For API requests, return JSON response
        if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        // For browser requests, redirect to login
        return res.redirect('/auth/login');
    }
};

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    if (req.user.role !== 'admin') {
        return res.status(403).render('error', {
            message: 'Access denied. Admin privileges required.'
        });
    }

    next();
};

module.exports = {
    checkAuth,
    checkAdmin
}; 