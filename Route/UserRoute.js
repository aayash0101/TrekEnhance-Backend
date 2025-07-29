const express = require('express');
const router = express.Router();
const userController = require('../Controller/UserController');

// Existing user routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/', userController.getAllUsers);
router.get('/profile/:id', userController.getProfile);
router.put('/profile/:id', userController.updateProfile);
router.delete('/:id', userController.deleteUser);

// New saved journals routes
router.get('/:userId/saved', userController.getSavedJournals);
router.post('/:userId/saved/:journalId', userController.addSavedJournal);
router.delete('/:userId/saved/:journalId', userController.removeSavedJournal);

// New favorite journals routes
router.get('/:userId/favorites', userController.getFavoriteJournals);
router.post('/:userId/favorites/:journalId', userController.addFavoriteJournal);
router.delete('/:userId/favorites/:journalId', userController.removeFavoriteJournal);

module.exports = router;
