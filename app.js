// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const userRoutes = require('./Route/UserRoute');
const trekRoutes = require('./Route/TrekRoute');
const journalRoutes = require('./Route/journalRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5174',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/treks', trekRoutes);
app.use('/api/journals', journalRoutes);

// Simple test route
app.get('/hey', (req, res) => {
  res.send('Hello World!');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
