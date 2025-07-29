const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },

  savedJournals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JournalEntry' }],
  favoriteJournals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JournalEntry' }],

});

module.exports = mongoose.model('User', userSchema);
