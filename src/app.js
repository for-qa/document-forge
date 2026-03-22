const express = require('express');
const path = require('path');
const generateRoutes = require('./routes/generate.routes');

const app = express();

/**
 * Global Middlewares
 */
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

/**
 * API Routing Registry
 */
app.use('/api/generate', generateRoutes);

module.exports = app;
