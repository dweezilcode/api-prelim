require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('./_middleware/error-handler'); // Adjust the path

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Register routes
app.use('/api/users', require('./users/users.controller'));
app.use('/api/users', require('./users/activity.controller')); // Ensure this is correctly registered

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
