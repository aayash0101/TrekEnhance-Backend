const JournalEntry = require('../Model/JournalModel');

// Create new journal entry
exports.createEntry = async (req, res) => {
  try {
    const { userId, trekId, date, text } = req.body;
    let photos = [];

    if (typeof req.body.photos === 'string') photos = [req.body.photos];
    else if (Array.isArray(req.body.photos)) photos = req.body.photos;

    if (req.files?.length) {
      const uploadedPaths = req.files.map(file => `/uploads/${file.filename}`);
      photos = photos.concat(uploadedPaths);
    }

    const newEntry = new JournalEntry({ userId, trekId, date, text, photos });
    await newEntry.save();
    console.log('Created new journal entry:', newEntry._id);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error creating journal entry:', err);
    res.status(500).json({ message: 'Failed to create journal entry' });
  }
};

// Get all journal entries (public feed)
exports.getAllEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username')
      .populate('trekId', 'name');
    res.json(entries);
  } catch (err) {
    console.error('Error fetching all entries:', err);
    res.status(500).json({ message: 'Failed to fetch all journal entries' });
  }
};

// Get journal entries for specific trek & user
exports.getEntries = async (req, res) => {
  try {
    const { trekId, userId } = req.params;
    const entries = await JournalEntry.find({ trekId, userId })
      .sort({ date: -1 })
      .populate('userId', 'username')
      .populate('trekId', 'name');
    res.json(entries);
  } catch (err) {
    console.error('Error fetching entries by trek & user:', err);
    res.status(500).json({ message: 'Failed to fetch entries for this trek & user' });
  }
};

// Update journal entry by ID
exports.updateEntry = async (req, res) => {
  try {
    const { date, text } = req.body;
    let photos = [];

    if (typeof req.body.photos === 'string') photos = [req.body.photos];
    else if (Array.isArray(req.body.photos)) photos = req.body.photos;

    if (req.files?.length) {
      const uploadedPaths = req.files.map(file => `/uploads/${file.filename}`);
      photos = photos.concat(uploadedPaths);
    }

    const updatedEntry = await JournalEntry.findByIdAndUpdate(
      req.params.id,
      { date, text, photos },
      { new: true }
    );
    if (!updatedEntry) return res.status(404).json({ message: 'Journal entry not found' });

    console.log('Updated journal entry:', updatedEntry._id);
    res.json(updatedEntry);
  } catch (err) {
    console.error('Error updating journal entry:', err);
    res.status(500).json({ message: 'Failed to update journal entry' });
  }
};

// Delete journal entry by ID
exports.deleteEntry = async (req, res) => {
  try {
    const deleted = await JournalEntry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Journal entry not found' });

    console.log('Deleted journal entry:', deleted._id);
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (err) {
    console.error('Error deleting journal entry:', err);
    res.status(500).json({ message: 'Failed to delete journal entry' });
  }
};

// ✅ Get all entries by a user
exports.getEntriesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await JournalEntry.find({ userId })
      .sort({ createdAt: -1 })
      .populate('trekId', 'name');
    res.json(entries);
  } catch (err) {
    console.error('Error fetching entries by user:', err);
    res.status(500).json({ message: 'Failed to fetch user journals' });
  }
};
