require('dotenv').config({ path: '.env' });

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');
const contentRoutes = require('./app/routes/contentRoutes');
const imageRoutes = require('./app/routes/imageRoutes');

const config = require('./config/config');

const app = express();

// Middleware to parse JSON-encoded bodies with increased size limit (e.g., 10MB)
app.use(express.json({ limit: "10mb" }));
// Middleware
app.use(bodyParser.json());



// Routes
app.use('/auth', authRoutes); // login
app.use('/user', userRoutes); // user profile
app.use('/image', imageRoutes); // upload images over S3
app.use('/content', contentRoutes); // contents in different language

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
