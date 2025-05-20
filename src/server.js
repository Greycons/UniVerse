require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('../db/db.config');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB Atlas
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB Atlas:', err);
    process.exit(1);
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB,
        ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: false // Set to true in production with HTTPS
    }
}));

// Add user to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('homepage', {
        title: 'College Web App - Home'
    });
});

// Add routes for other pages
app.get('/laundry', (req, res) => {
    res.render('laundry', {
        title: 'Laundry Service'
    });
});

app.get('/canteen', (req, res) => {
    res.render('canteen', {
        title: 'Canteen Pre-order'
    });
});

app.get('/clubs', (req, res) => {
    res.render('clubs', {
        title: 'Join Clubs'
    });
});

app.get('/permissions', (req, res) => {
    res.render('permissions', {
        title: 'Issue Permissions'
    });
});

app.get('/alumni', (req, res) => {
    res.render('alumni', {
        title: 'Alumni Connect'
    });
});

app.get('/feedback', (req, res) => {
    res.render('feedback', {
        title: 'Feedback'
    });
});

// Import and use route files
const authRoutes = require('../routes/auth.routes');
const userRoutes = require('../routes/user.routes');
const permissionRoutes = require('../routes/permission.routes');
const eventRoutes = require('../routes/event.routes');
const adminRoutes = require('../routes/admin.routes');

// Mount auth routes
app.use('/auth', authRoutes);

// Mount user routes at root level for views
app.use('/', userRoutes);

// Mount API routes
app.use('/api/users', userRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/events', eventRoutes);

// Mount admin routes
app.use('/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error',
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
