const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({wxtended:false}));   // Parsing the form
app.use(session({
    secret: 'dogwalk-secret',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app.use('/',          authRoutes);
app.use('/api', userRoutes);

// Export the app instead of listening here
module.exports = app;