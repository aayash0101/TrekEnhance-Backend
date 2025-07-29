const mongoose = require('mongoose');

// Define reviewSchema first
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  review: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Now define trekSchema and reference reviewSchema inside it
const trekSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  smallDescription: String,
  description: String,
  difficulty: { type: String, enum: ['EASY', 'MODERATE', 'HARD'], default: 'EASY' },
  distance: Number,
  bestSeason: String,
  imageUrl: String,
  highlights: [String],
  reviews: [reviewSchema]  // <-- use it here
}, { timestamps: true });

module.exports = mongoose.model('Trek', trekSchema);
