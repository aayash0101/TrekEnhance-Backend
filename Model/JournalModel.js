const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trekId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trek', required: true },
  date: { type: String, required: true },
  text: { type: String, required: true },
  photos: [String], // store photo URLs
}, { timestamps: true });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
