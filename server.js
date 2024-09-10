require('rootpath')(); // Ensure the root path is set up correctly
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler'); // Ensure this path is correct
const userRoutes = require('./users/user.routes'); // Ensure this path is correct

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api/users', userRoutes); // Adjust the path if necessary

// Error Handling Middleware
app.use(errorHandler);

// Server Initialization
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
