const Trek = require('../Model/TrekModel');

// Create a new trek
exports.createTrek = async (req, res) => {
  try {
    const {
      name,
      location,
      smallDescription,
      description,
      difficulty,
      distance,
      bestSeason,
      highlights
    } = req.body;

    // If multer uploaded a file, use its path, else fallback to req.body.imageUrl
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    // Parse highlights (comma-separated string to array)
    const parsedHighlights = typeof highlights === 'string'
      ? highlights.split(',').map(h => h.trim())
      : highlights;

    const newTrek = new Trek({
      name,
      location,
      smallDescription,
      description,
      difficulty,
      distance,
      bestSeason,
      imageUrl,
      highlights: parsedHighlights
    });

    await newTrek.save();
    res.status(201).json(newTrek);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all treks
exports.getTreks = async (req, res) => {
  try {
    const treks = await Trek.find();
    res.json(treks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single trek by ID
exports.getTrekById = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });
    res.json(trek);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update trek by ID
exports.updateTrek = async (req, res) => {
  try {
    const {
      highlights, // possibly comma-separated
      ...restFields
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    const updateData = {
      ...restFields,
      ...(highlights && {
        highlights: typeof highlights === 'string'
          ? highlights.split(',').map(h => h.trim())
          : highlights
      }),
      ...(imageUrl && { imageUrl })
    };

    const updatedTrek = await Trek.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedTrek) return res.status(404).json({ message: 'Trek not found' });
    res.json(updatedTrek);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete trek by ID
exports.deleteTrek = async (req, res) => {
  try {
    const deletedTrek = await Trek.findByIdAndDelete(req.params.id);
    if (!deletedTrek) return res.status(404).json({ message: 'Trek not found' });
    res.json({ message: 'Trek deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { trekId } = req.params;
    const { userId, username, review } = req.body;

    if (!userId || !username || !review) {
      return res.status(400).json({ message: 'Missing userId, username or review' });
    }

    const trek = await Trek.findById(trekId);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });

    trek.reviews.push({ userId, username, review });
    await trek.save();

    return res.status(201).json({ message: 'Review added', reviews: trek.reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { trekId } = req.params;
    const trek = await Trek.findById(trekId).select('reviews');
    if (!trek) return res.status(404).json({ message: 'Trek not found' });

    return res.json(trek.reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
// GET /api/treks/reviews/all
exports.getAllReviewsFromAllTreks = async (req, res) => {
  try {
    const treks = await Trek.find({}, 'name imageUrl reviews'); // only fetch necessary fields
    res.json(treks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};
