const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const authController = {
    // Render login page
    getLogin: (req, res) => {
        res.render('login', {
            title: 'Login',
            user: req.session.user || null
        });
    },

    // Render signup page
    getSignup: (req, res) => {
        res.render('signup', {
            title: 'Sign Up',
            user: req.session.user || null
        });
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log('Login attempt for username:', username);
            
            // Find user by username
            const user = await User.findOne({ username }).select('+password');
            if (!user) {
                console.log('User not found');
                return res.render('login', {
                    title: 'Login',
                    error: 'Invalid credentials',
                    user: null
                });
            }

            // Check password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                console.log('Invalid password');
                return res.render('login', {
                    title: 'Login',
                    error: 'Invalid credentials',
                    user: null
                });
            }

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Set session
            req.session.user = {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            };

            // Save session before redirect
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.render('login', {
                        title: 'Login',
                        error: 'An error occurred during login',
                        user: null
                    });
                }

                console.log('Login successful for user:', user.username, 'Role:', user.role);

                // Redirect based on role
                if (user.role === 'admin') {
                    return res.redirect('/admin/dashboard');
                }
                return res.redirect('/');
            });

        } catch (error) {
            console.error('Login error:', error);
            return res.render('login', {
                title: 'Login',
                error: 'An error occurred during login',
                user: null
            });
        }
    },

    signup: async (req, res) => {
        try {
            const { username, password, email, confirmPassword } = req.body;

            // Validate password confirmation
            if (password !== confirmPassword) {
                return res.render('signup', {
                    title: 'Sign Up',
                    error: 'Passwords do not match',
                    user: null
                });
            }

            // Check if user already exists using case-insensitive search
            const existingUser = await User.findOne({
                $or: [
                    { username: { $regex: new RegExp(`^${username}$`, 'i') } },
                    { email: { $regex: new RegExp(`^${email}$`, 'i') } }
                ]
            });

            if (existingUser) {
                return res.render('signup', {
                    title: 'Sign Up',
                    error: 'Username or email already exists',
                    user: null
                });
            }

            // Create new user
            const user = new User({
                username,
                password,
                email,
                lastLogin: new Date()
            });

            await user.save();

            // Set session
            req.session.user = {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            };

            // Save session before redirect
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.render('signup', {
                        title: 'Sign Up',
                        error: 'An error occurred during signup',
                        user: null
                    });
                }

                res.redirect('/');
            });
        } catch (error) {
            console.error('Signup error:', error);
            res.render('signup', {
                title: 'Sign Up',
                error: 'An error occurred during signup',
                user: null
            });
        }
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
                return res.status(500).json({ message: 'Error during logout' });
            }
            res.redirect('/login');
        });
    }
};

module.exports = authController; 