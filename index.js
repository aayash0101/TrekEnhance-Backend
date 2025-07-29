require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/db');
const userRoutes = require('./Route/UserRoute');
const trekRoutes = require('./Route/TrekRoute');
const journalRoutes = require('./Route/journalRoutes');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware for CORS and JSON parsing
app.use(cors({
  origin: 'http://localhost:5174',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Serve uploads folder statically for image access
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/users", userRoutes);
app.use('/api/treks', trekRoutes);
app.use('/api/journals', journalRoutes);

// Simple test route
app.get('/hey', (req, res) => {
  res.send('Hello World!');
});

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`);
});
