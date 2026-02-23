require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
// connect DB
require('./config/db')();
// body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// serve static files
app.use(express.static(path.join(__dirname, 'public')));
// routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/users', require('./routes/userRoutes'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
