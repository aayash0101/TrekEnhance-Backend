const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  createTrek,
  getTreks,
  getTrekById,
  updateTrek,
  deleteTrek,
  addReview,
  getReviews,
  getAllReviewsFromAllTreks
} = require('../Controller/TrekController');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// CRUD routes
router.post('/', upload.single('image'), createTrek);
router.get('/', getTreks);
router.get('/:id', getTrekById);
router.put('/:id', upload.single('image'), updateTrek);
router.delete('/:id', deleteTrek);

// Review routes
router.post('/:trekId/reviews', addReview);
router.get('/:trekId/reviews', getReviews);
router.get('/reviews/all', getAllReviewsFromAllTreks);

// Upload route
router.post('/upload', upload.single('image'), (req, res) => {
  res.json({ imageUrl: '/uploads/' + req.file.filename });
});

module.exports = router;
