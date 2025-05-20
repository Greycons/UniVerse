const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const { log } = require('console');

const app = express();
const port = 3000;

// mysql connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mysqldb@2004',
  database: 'project'
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    console.log("home page");
  res.sendFile(path.join(__dirname, 'PROJEXT.html'));
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log("username & pwd: " + username + " " + password);
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  connection.query(query, [username, password], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length > 0) {
      
      res.redirect('/homepage.html');
    } else {
      
      res.redirect('/');
    }
  });
});


app.get('/homepage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'homepage.html'));
});

app.post('/savePermission', (req, res) => {
  
  const { venues, club, date, time1, time2, purpose } = req.body;
  console.log("v c t t")

  console.log(venues + " " + club + " " + date + " " + time1 + " " + time2 + " " + purpose);
  
  if (!venues || !club || !date || !time1 || !time2 || !purpose) {
      return res.status(400).send('Please fill all the fields.');
  }

  
  const availabilityQuery = `SELECT * FROM permissions 
                             WHERE venue = ? 
                             AND date = ? 
                             AND ((time1 <= ? AND time2 >= ?) 
                                  OR (time1 <= ? AND time2 >= ?) 
                                  OR (time1 >= ? AND time2 <= ?))`;
    connection.query(availabilityQuery, [venues, date, time2, time1, time1, time2, time1, time2], (error, results) => {
      if (error) {
          console.error('Error checking availability:', error);
          return res.status(500).send('Internal Server Error');
      }

      if (results.length > 0) {
          return res.status(409).send('Venue not available for the specified time.');
      }

      
      const insertQuery = 'INSERT INTO permissions (venue, club, date, time1, time2, purpose) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(insertQuery, [venues, club, date, time1, time2, purpose], (insertError, insertResults) => {
          if (insertError) {
              console.error('Error saving permission:', insertError);
              return res.status(500).send('Internal Server Error');
          }
          return res.status(200).send('Permission saved successfully.');
      });
  });
});
app.post('/submit-form', (req, res) => {
  const formData = req.body;
  const query = 'INSERT INTO form_data SET ?';
  connection.query(query, formData, (error, results, fields) => {
    if (error) {
      console.error('Error inserting data into MySQL: ', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Data inserted successfully');
    res.send('Form submitted successfully');
  });
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  
  if (!username || !password) {
    return res.status(400).send('Please fill all the fields.');
  }

  
  const checkQuery = 'SELECT * FROM users WHERE username = ?';
  connection.query(checkQuery, [username], (error, results) => {
    if (error) {
      console.error('Error checking user:', error);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      return res.status(409).send('Username already exists.');
    }

    
    const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
    connection.query(insertQuery, [username, password], (insertError, insertResults) => {
      if (insertError) {
        console.error('Error inserting user:', insertError);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/');
    });
  });
});

// GET route for serving homepage.html
app.get('/homepage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'homepage.html'));
});


app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});