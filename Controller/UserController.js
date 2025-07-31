const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../Model/UserModel');
const Journal = require('../Model/JournalModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Multer storage configuration for profile pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder to save uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage: storage });

// Upload profile picture handler
exports.uploadProfilePicture = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Build image URL or relative path
  const imageUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    message: 'Image uploaded successfully',
    data: imageUrl,
  });
};


// Get all users (without passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Get user profile by ID
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid user ID' });

    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile by ID
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid user ID' });

    // Build update fields dynamically
    const updateFields = {};
    if (req.body.username) updateFields.username = req.body.username;
    if (req.body.bio) updateFields.bio = req.body.bio;
    if (req.body.location) updateFields.location = req.body.location;
    if (req.body.profileImageUrl) updateFields.profileImageUrl = req.body.profileImageUrl;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Signup new user
exports.signup = async (req, res) => {
  try {
    const { username, password, email, profileImageUrl } = req.body;

    if (!username || !password || !email)
      return res.status(400).json({ message: 'All fields are required' });

    if (await User.findOne({ username }))
      return res.status(400).json({ message: 'Username already taken' });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      profileImageUrl: profileImageUrl || ''
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set');

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImageUrl: user.profileImageUrl
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid user ID' });

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get saved journals of user
exports.getSavedJournals = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching saved journals for user:', userId);
    const user = await User.findById(userId).populate('savedJournals');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.savedJournals);
  } catch (err) {
    console.error('Error fetching saved journals:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Add a journal to saved list
exports.addSavedJournal = async (req, res) => {
  try {
    const { userId, journalId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(journalId)) {
      return res.status(400).json({ message: 'Invalid journal ID' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const journal = await Journal.findById(journalId);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });

    if (!user.savedJournals.includes(journalId)) {
      user.savedJournals.push(journalId);
      await user.save();
    }

    res.json({ message: 'Journal saved successfully' });
  } catch (err) {
    console.error('Error adding saved journal:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a journal from saved list
exports.removeSavedJournal = async (req, res) => {
  try {
    const { userId, journalId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(journalId)) {
      return res.status(400).json({ message: 'Invalid journal ID' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedJournals: journalId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Journal removed from saved' });
  } catch (err) {
    console.error('Error removing saved journal:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get favorite journals of user
exports.getFavoriteJournals = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId).populate('favoriteJournals');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.favoriteJournals);
  } catch (err) {
    console.error('Error fetching favorite journals:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a journal to favorites list
exports.addFavoriteJournal = async (req, res) => {
  try {
    const { userId, journalId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(journalId)) {
      return res.status(400).json({ message: 'Invalid journal ID' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const journal = await Journal.findById(journalId);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });

    if (!user.favoriteJournals.includes(journalId)) {
      user.favoriteJournals.push(journalId);
      await user.save();
    }

    res.json({ message: 'Journal added to favorites' });
  } catch (err) {
    console.error('Error adding favorite journal:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a journal from favorites list
exports.removeFavoriteJournal = async (req, res) => {
  try {
    const { userId, journalId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(journalId)) {
      return res.status(400).json({ message: 'Invalid journal ID' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteJournals: journalId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Journal removed from favorites' });
  } catch (err) {
    console.error('Error removing favorite journal:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
