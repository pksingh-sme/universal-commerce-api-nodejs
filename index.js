/*
 * Filename: index.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Description: Main application file to configure and start the server
 * Version: 1.0
 */

require('dotenv').config({ path: '.env' });

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');
const contentRoutes = require('./app/routes/contentRoutes');
const imageRoutes = require('./app/routes/imageRoutes');
const addressRoutes = require('./app/routes/addressRoutes');
const projectRoutes = require('./app/routes/projectRoutes');
const cartRoutes = require('./app/routes/cartRoutes');
const orderRoutes = require('./app/routes/orderRoutes');

const config = require('./config/config');

const app = express();

// Middleware to parse JSON-encoded bodies with increased size limit (e.g., 10MB)
app.use(express.json({ limit: "10mb" }));

// Body parser middleware
app.use(bodyParser.json());

// Routes configuration
app.use('/auth', authRoutes); // Routes for user authentication (e.g., login)
app.use('/user', userRoutes); // Routes for managing user profiles
app.use('/image', imageRoutes); // Routes for uploading images over S3
app.use('/content', contentRoutes); // Routes for accessing contents in different languages
app.use('/address', addressRoutes); // Routes for managing user's billing and shipping addresses
app.use('/projects', projectRoutes); // Routes for managing projects
app.use('/cart', cartRoutes); // Routes for managing user's cart
app.use('/orders', orderRoutes); // Routes for managing orders

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});