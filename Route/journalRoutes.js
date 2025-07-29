const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const JournalController = require('../Controller/JournalController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''))
});
const upload = multer({ storage });

// Routes (order matters!)
router.post('/', upload.array('photos', 5), JournalController.createEntry);
router.get('/user/:userId', JournalController.getEntriesByUser); // ✅ get all entries by a user
router.get('/:trekId/:userId', JournalController.getEntries);    // get entries by trek & user
router.get('/', JournalController.getAllEntries);                // public feed
router.put('/:id', upload.array('photos', 5), JournalController.updateEntry);
router.delete('/:id', JournalController.deleteEntry);

module.exports = router;
