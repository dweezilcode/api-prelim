require('rootpath')();  // Ensure this is used correctly, typically to set the root path for module imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');
const userRoutes = require('./users/users.controller');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware (should be the last middleware)
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log the error stack for debugging
    res.status(500).send('Something went wrong!');
});
app.use(errorHandler);  // Custom error handling middleware

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});