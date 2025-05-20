const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mysqldb@2004',
    database: 'project',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to serve permission.html
app.get('/permission', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'permission.html'));
});

// POST route for saving permission
app.post('/savePermission', (req, res) => {
    // Handle the form submission here
    const formData = req.body;
    console.log(formData); // Log the form data to the console
    // Perform any necessary processing or database operations
    // Send a response back to the client
    res.send('Form submitted successfully');
});

// Endpoint to handle form submission
 app.post('/savePermission', (req, res) => {
    // Extract form data from request body
    const { venues, club, date, time1, time2, purpose } = req.body;
    console.log("v c t t")

    // Check if all fields are provided
    if (!venues || !club || !date || !time1 || !time2 || !purpose) {
        return res.status(400).send('Please fill all the fields.');
    }

    // Check if the venue is available for the specified time
    const availabilityQuery = `SELECT * FROM permissions 
                               WHERE venue = ? 
                               AND date = ? 
                               AND ((time1 <= ? AND time2 >= ?) 
                                    OR (time1 <= ? AND time2 >= ?) 
                                    OR (time1 >= ? AND time2 <= ?))`;
    pool.query(availabilityQuery, [venues, date, time2, time1, time1, time2, time1, time2], (error, results) => {
        if (error) {
            console.error('Error checking availability:', error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            return res.status(409).send('Venue not available for the specified time.');
        }

        // If venue is available, save the permission
        const insertQuery = 'INSERT INTO permissions (venue, club, date, time1, time2, purpose) VALUES (?, ?, ?, ?, ?, ?)';
        pool.query(insertQuery, [venues, club, date, time1, time2, purpose], (insertError, insertResults) => {
            if (insertError) {
                console.error('Error saving permission:', insertError);
                return res.status(500).send('Internal Server Error');
            }
            return res.status(200).send('Permission saved successfully.');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('pp.js')
});
