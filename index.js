require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/db');
const userRoutes = require('./Route/UserRoute');
const trekRoutes = require('./Route/TrekRoute');
const journalRoutes = require('./Route/journalRoutes');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5174',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/treks', trekRoutes);
app.use('/api/journals', journalRoutes);

// Simple test route
app.get('/hey', (req, res) => {
  res.send('Hello World!');
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
