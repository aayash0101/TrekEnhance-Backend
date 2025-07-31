const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../Controller/UserController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
// Auth routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// User profile
router.get('/', userController.getAllUsers);
router.get('/profile/:id', userController.getProfile);
router.put('/profile/:id', userController.updateProfile);
router.delete('/:id', userController.deleteUser);
router.post('/upload-image', upload.single('profilePicture'), userController.uploadProfilePicture);

// Saved journals
router.get('/:userId/saved', userController.getSavedJournals);
router.post('/:userId/saved/:journalId', userController.addSavedJournal);
router.delete('/:userId/saved/:journalId', userController.removeSavedJournal);

// Favorite journals
router.get('/:userId/favorites', userController.getFavoriteJournals);
router.post('/:userId/favorites/:journalId', userController.addFavoriteJournal);
router.delete('/:userId/favorites/:journalId', userController.removeFavoriteJournal);

module.exports = router;
