# College Web Application

A web application for college management with features like user authentication, events management, and more.

## Project Structure

```
├── controllers/     # Route controllers
├── db/             # Database configuration
├── middlewares/    # Custom middlewares
├── models/         # Database models
├── public/         # Static files (HTML, CSS, images)
├── routes/         # API routes
├── src/            # Source code
└── utils/          # Utility functions
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=project
   DB_PORT=3000
   JWT_SECRET=your_jwt_secret_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- User authentication (login/signup)
- Events management
- Club management
- Student portal
- Admin dashboard

## Technologies Used

- Node.js
- Express.js
- MySQL
- JWT for authentication
- HTML/CSS/JavaScript 