require('dotenv').config({ path: '.env' });

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');
const contentRoutes = require('./app/routes/contentRoutes');
const config = require('./config/config');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes); // login
app.use('/user', userRoutes); // user profile
app.use('/content', contentRoutes); // contents in different language

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
